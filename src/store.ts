// https://vuejs.org/v2/guide/state-management.html#Simple-State-Management-from-Scratch


// @ts-ignore <- nécessaire car cet ANDOUILLE de linter est incapable de voir que cela marche...
import {SendingType} from "@/views/app.editique/Content.vue";
// tslint:disable
const Store = {
    User: {
        mail: '',
        login: 'tibermont' as string | null,
        password: 'codinez' as string | null,
        token: '',
    },

    //
    'Applications': {
        'Worklist': {
            patients: [] as any[],
            // Used to share with the bedmanager availability research module (or anything else in the future?)
            selectedPatient: null as any | null,
            listFilters: {
                service: null,
                ipp: null,
                firstName: null,
                lastName: null,
                motive: null,
                comment: null,
            }
        },
        'Organizer': {
            'Settings': {
                // How many days should be displayed in the bed occupation screen
                'defaultDisplayDaysNumber': 7 as number,
                // Size of a slot in minutes WARNING: be sure to use a 60 divider (30 20 15, 10, 6, 5 etc.)
                'defaultDisplaySlotDuration': 15 as number,
                // begin and end working hours
                'dayHourStart': 5 as number, // WARNING: because of the timezone offsets, minimum must be 3h
                'dayHourEnd': 21 as number, // WARNING: because of the timezone offsets, maximum must be 21h

                'researchSlotDuration': 240 as number,
            },
            // list every allowed plannings
            'planningList': [] as object[],
            // list of availabilities according to a given research
            'availabilities': [] as any[],
            // list of events that will be displayed in the planning (from agenda_f1)
            'events': [] as object[],
            // list of events that will be displayed on the scheduling (from agenda_f2)
            'scheduling': [] as object[],
            // motives by services and their needed resources
            'motives': [
            ],

        },
        'Editique': {
            'Settings': {

            },
            'data': {
                'messagesList': [] as object[],
                'filter': {
                    'fromDate': null as Date | null,
                    'toDate': null as Date | null,
                    'patientId': null as number | null,
                    'patientName': null as string | null,
                    'recipientId': null as number | null,
                    'recipientName': null as string | null,
                    'serviceId': null as number | null,
                    'serviceName': null as string | null,
                    'sendingType': null as SendingType | null,
                },
            },
        },
        'ParamTypeVenue': {
            "Settings": {

            },
            'data': {
                'messagesList': [] as object[],
                'filter': {
                    'motifLabel': null as string | null,
                }
            }
        },
        'Protocolisation': {
            'Settings': {

            },
            'data': {
                'messagesList': [] as object[],
                'metaDocTypes': [] as object[],
                'filter': {
                    'fromDate': null as Date | null,
                    'toDate': null as Date | null,
                },
            },
        },
        'GED': {
            'Settings': {

            },
            'data': {
                'messagesList': [] as object[],
                'menuCategories': [] as object[],
                'treeProperties': [] as object[],
                'listArbo': [] as object[],
                'saveList': [] as object[],
                'filter': {
                    
                }
            }
        },
    },

    // Available thanks to "client_getall" command
    'globalData': {
        'services': [
            // HACK:
            { id: '3604', label: 'Urgence' },
            { id: '3605', label: 'Chir plasti.' },
        ] as object[],
        'authors': [] as object[],
        'authorsAuthorizations': [] as object[],
        'secretaries': [] as object[],
        'secretariesAuthorizations': [] as object[],
        'docTypes': [] as object[],
        'ufs': [] as object[],
        'poles': [] as object[],
        'establishments': [] as object[],

        'natures': [
            {id: 1, label: 'HPDD'},
            {id: 2, label: 'HC'},
        ] as object[],
        'otherNatures': [
            {id: 3, label: 'HDJ'},
            {id: 4, label: 'GPHDJ'},
            {id: 5, label: 'Chambre'},
            {id: 6, label: 'AMBU'},
            {id: 7, label: 'Bloc'},
        ] as object[],
        
        'ressources': [] as object[],
    },

    // Everything about notifications
    'Notifications': {},

    'Settings': {},
};

export default Store;
