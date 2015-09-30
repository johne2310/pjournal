(function () {
    'use strict';

    angular
        .module('pjournal')
        .factory('journalStore', journalStore);

    function journalStore($q) {


        var localDB;
        var journals;


        return {

            initDB: function () {
                // Creates the database or opens if it already exists
                localDB = new PouchDB("journaldbDev", {
                    adapter: 'websql'
                });
            },

            getAllJournals: function () {
                if (!journals) {
                    console.log('Reading DB');
                    return $q.when(localDB.allDocs({
                            include_docs: true
                        }))
                        .then(function (docs) {

                            // Each row has a .doc object and we just want to send an
                            // array of journal objects back to the calling controller,
                            // so let's map the array to contain just the .doc objects.
                            journals = docs.rows.map(function (row) {
                                // Dates are not automatically converted from a string.
                                row.doc.date = new Date(row.doc.date);
                                return row.doc;
                            });

                            // Listen for changes on the database.
                            localDB.changes({
                                    live: true,
                                    since: 'now',
                                    include_docs: true
                                })
                                .on('change', onDatabaseChange);

                            return journals;
                        });
                } else {
                    // Return cached data as a promise
                    console.log('Getting from cache');
                    return $q.when(journals);
                }
            },

            getJournal: function (journalId) {
                for (var i = 0; i < journals.length; i++) {
                    //                console.log('JournalId is ', journalId);
                    //TODO define field to use as ID
                    if (journals[i].Drug === journalId) {
                        return journals[i];
                    }
                }
                return undefined;
            },

            addJournal: function (journal) {
                console.log('Putting journal');
                return $q.when(localDB.put(journal));
            },

            updateJournal: function (journal) {
                return $q.when(localDB.put(journal));
            },
            deleteJournal: function (journal) {
                return $q.when(localDB.remove(journal));
            }
        };
        //end main return


        function onDatabaseChange(change) {
            var index = findIndex(journals, change.id);
            var journal = journals[index];

            console.log('Change starting...');
            if (change.deleted) {
                if (journal) {
                    journals.splice(index, 1); // delete
                    return $q.when(journals);
                    //                    getAllJournals();
                }
            } else {
                if (journal && journal._id === change.id) {
                    journals[index] = change.doc; // update
                    return $q.when(journals);
                    //                    getAllJournals();
                } else {
                    console.log('Starting add...');
                    journals.splice(index, 0, change.doc); // insert
                    return $q.when(journals);
                    //                    getAllJournals();
                }
            }
        }

        function findIndex(array, id) {
            var low = 0,
                high = array.length,
                mid;
            while (low < high) {
                mid = (low + high) >>> 1;
                array[mid]._id < id ? low = mid + 1 : high = mid
            }
            return low;
        }


    }

    //end wrapper function
})();
