/**
 * Expose 1 public method to 1 server route.
 * Each of these routes resolve its promise by a parsed response.
 *
 * This file describes enum at the beginning, grouped by their
 *
 */
import Server from '@/adapters/server.ts';
import {jsDateToServerDate, jsDateToFrenchServerDate} from '@/lib/date';
import apiExterne from '../adapters/apiExterne';
// Options used to filter on some plannings: current one, every authorized one or a filter by nature
enum PLANNINGS_KIND_OPT { CURRENT = 'CURRENT', ALL = 'ALL', BY_NATURE = 'BY_NATURE'}
// Options used to find appointment ASAP, or between two dates
enum PERIOD_OPT { ASAP = 'ASAP', PERIOD = 'PERIOD' }

export {PLANNINGS_KIND_OPT, PERIOD_OPT, PortalAPI};
export default class PortalAPI {

    /**
     * Complex method allowing to find a list of accurate availabilities.
     * @return a list of structured availabilities!
     */
    public static agendaCreneaux(
        durationInMinutes: number = 240,
        planningsOpt: PLANNINGS_KIND_OPT = PLANNINGS_KIND_OPT.CURRENT,
        periodOpt: PERIOD_OPT = PERIOD_OPT.ASAP,
        natures?: string[],
        dateFrom?: Date,
        dateTo?: Date): Promise<object[]> {
        return new Promise((resolve, reject) => {

            // Produce suitable query string according to params
            let query: string = 'command=agenda_creneaux&p1=&p2=&p3=';
            // Set query filter duration, plannings options and date options
            query += 'Duree_' + durationInMinutes + ';';
            query += this.buildPlanningsKindQueryPart(planningsOpt, natures);
            query += this.buildPeriodKindQueryPart(periodOpt, dateFrom, dateTo);

            // Sending query to portal
            Server.send(query)
                .then((response: string) => {
                    const availabilities = response.split('\n');
                    const parsedResponse: object[] = [];
                    availabilities.shift();
                    for (const item of availabilities) {
                        const obj = item.split('|');
                        if (obj.length <= 1)  {
                            continue;
                        }
                        const itemDate =
                            obj[3].substr(6, 4) + '-' +
                            obj[3].substr(3, 2) + '-' +
                            obj[3].substr(0, 2) + 'T' +
                            obj[3].substr(11, 2) + ':' +
                            obj[3].substr(14, 2) + ':00.000Z';
                        parsedResponse.push({
                            agendaLabel: obj[0],
                            agendaId: obj[1],
                            textualDate: obj[2],
                            isoDate: itemDate,
                        });
                    }
                    resolve(parsedResponse);
                })
                .catch((response: string) => {
                    reject(response);
                });
        });
    }


    /**
     * Handle every natures concerns to produce corresponding query filter part.
     * Handle 3 kind of selection:
     * - current planning
     * - every allowed planning
     * - filter by kind of plannings (natures)
     */
    private static buildPlanningsKindQueryPart(
        planningsOpt: PLANNINGS_KIND_OPT = PLANNINGS_KIND_OPT.CURRENT,
        natures?: string[]): string {

        let query = '';
        if (planningsOpt === PLANNINGS_KIND_OPT.BY_NATURE) {
            if (!natures) {
                throw new Error('Filter by nature without specifying "natures" parameter');
            } else {
                query += 'optParNature_X;optAgendaActuel_;Nature_' + natures.join(',') + ';';
            }
        }
        else if (planningsOpt === PLANNINGS_KIND_OPT.CURRENT) {
            query += 'optAgendaActuel_X;';
        }
        else if (planningsOpt === PLANNINGS_KIND_OPT.ALL) {
            query += 'optTous_X;optAgendaActuel_;';
        }
        // optAgendaActuel should always appear explicitly, even to be empty.
        return query;
    }


    /**
     * Handle two kinds or requests: ASAP or between two dates.
     *
     * @param periodOpt enum specifying kind of period we work on: ASAP or from ... to ...
     * @param dateFrom used to specify a begin date in case of PERIOD research option
     * @param dateTo used to specify a begin date in case of PERIOD research option
     */
    private static buildPeriodKindQueryPart(
        periodOpt: PERIOD_OPT, dateFrom?: Date, dateTo?: Date): string {
        // Two possibilities: ASAP or period
        let query = periodOpt === PERIOD_OPT.ASAP ? 'auPlusTot_X;' : 'optPeriodePreferee_X;';
        // Set convenient params according to the selected period options
        if (periodOpt === PERIOD_OPT.PERIOD && (!dateFrom || !dateTo)) {
            throw new Error('Filter by period without "dateFrom" or dateTo parameter');
        } else if (periodOpt === PERIOD_OPT.PERIOD) {
            const dateMin =
                ('0' + (dateFrom as Date).getDate()).substr(('0' + (dateFrom as Date).getDate()).length - 2) + '/' +
                (('0' + ((dateFrom as Date).getMonth() + 1)).substr(('0' + ((dateFrom as Date).getMonth() + 1)).length - 2)) + '/' +
                (dateFrom as Date).getFullYear() + ' ' +
                ('0' + (dateFrom as Date).getHours()).substr(('0' + (dateFrom as Date).getHours()).length - 2) + ':' +
                ('0' + (dateFrom as Date).getMinutes()).substr(('0' + (dateFrom as Date).getMinutes()).length - 2);

            const dateMax =
                ('0' + (dateTo as Date).getDate()).substr(('0' + (dateTo as Date).getDate()).length - 2) + '/' +
                (('0' + ((dateTo as Date).getMonth() + 1)).substr(('0' + ((dateTo as Date).getMonth() + 1)).length - 2)) + '/' +
                (dateTo as Date).getFullYear() + ' ' +
                ('0' + (dateTo as Date).getHours()).substr(('0' + (dateTo as Date).getHours()).length - 2) + ':' +
                ('0' + (dateTo as Date).getMinutes()).substr(('0' + (dateTo as Date).getMinutes()).length - 2);

            query += 'DateMin_' + dateMin + ';';
            query += 'DateMax_' + dateMax + ';';
        }
        return query;
    }


    /**
     * Grab the list of resources/plannings we have access to.
     * @param natures
     */
    public static agenda_f0(natures: string[]): Promise<object[]> {
        return new Promise((resolve, reject) => {
            const query = 'command=agenda_f0&p1=&p2=' + natures.join(';');
            const resources: object[] = [];
            Server.send(query)
                .then((response: string) => {
                    const splitResponse = response.split('\n');
                    for (let i = 1; i < splitResponse.length; i++ ) {
                        const item: string[] = splitResponse[i].split(';');
                        if (item.length <= 1)  {
                            continue;
                        }
                        resources.push({
                            label: item[0],
                            resourceId: item[1],
                            type: item[2],
                            color: item[3],
                        });
                    }
                    resolve(resources);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }


    /**
     * Recherche des rendez-vous pour un ensemble de nature, une date, et un laps de temps donné.
     ******
     *
     * @return
     *      un tableau de rendez-vous au format Json selon le formalisme décrit ci-après
     *
     * Exemple de requête :
     *      command=agenda_f1&p1=&p2=Chambre;(Aucune);(Aucune);(Aucune)&p3=2019-08-01;4 semaines.
     *
     * Exemple de réponse (1 ligne <=> 1 champ séparé par ";")
     * les lignes vides correspondent à des valeurs vides dans la réponse
     *        0  Mme
     *        1  Ophelie
     *        2  Ophelie
     *        3  2019-08-07 07:00:00
     *        4  6
     *        5  2019-08-08 12:00:00
     *        6  7,384615
     *        7  BRACHIOPLASTIE
     *        8  4297555
     *        9  Public
     *       10  Attendu§17854165§§61:+4297117+4297555+:4297555§600§1984-05-03 00:00:00§102688018
     *       11 2
     *       12 19
     *       13 Salles
     *       14 Salles de réveil
     *       15
     *       16
     *       17
     *       18
     *       19
     *       20
     *       21
     *       22 ¤Date bloc: 07/08/2018 -- Observations: 7H Esthétique devis ok
     *       23
     */
    public static agenda_f1(natures: string[], date: Date | undefined): Promise<object[]> {

        return new Promise( (resolve, reject) => {
            !date ? date = new Date(): null;

            const query = 'command=agenda_f1&p1=&p2=' + natures.join(';') + '&p3=' + jsDateToServerDate(date as Date) + ';2 semaines';
            const agendas: Array<any> = [];
            Server.send(query)
                .then((response: string) => {
                    const splitResponse = response.split('\n');
                    for (let i = 1; i < splitResponse.length; i++ ) {
                        const item: string[] = splitResponse[i].split(';');
                        if (item.length <= 11)  {
                            continue;
                        }
                        const idUF = item[10].split('�')[4] || "2";
                        let randomizedColor;
                        if(idUF === '598') {
                            randomizedColor = 'rose';
                        }
                        else if(idUF === '599') {
                            randomizedColor = 'vert';
                        }
                        else if(idUF === '600') {
                            randomizedColor = 'rouge';
                        }
                        else if(idUF === '700') {
                            randomizedColor = 'rose';
                        }
                        else if(idUF === '701') {
                            randomizedColor = 'vert';
                        }
                        else if(idUF === '702') {
                            randomizedColor = 'rouge';
                        }
                        else if(idUF === '703') {
                            randomizedColor = 'bleu';
                        }
                        else {
                            randomizedColor = 'bleu';
                        }

                        item[22] = item[22] && item[22].length? item[22].replace('�', ''): '';
                        agendas.push({
                            civility: item[0],
                            firstName: item[1],
                            lastName: item[2],
                            beginDate: item[3],
                            endDate: item[5],
                            motive: item[7],
                            type: item[9],
                            status: item[10].split('+')[0].split('�')[0],
                            id: item[10].split('+')[1] || uuidv4(),
                            optimalEndDate: item[10].split('�')[2] || null, // according to PMSI?
                            birthDate: item[10].split('�')[5],
                            age: (new Date().getFullYear() - new Date(item[10].split('�')[5]).getFullYear()) || undefined,
                            resourceId: item[11],
                            resource1: item[13],
                            typdoc1: item[14],
                            resource2: item[15],
                            typdoc2: item[16],
                            resource3: item[17],
                            typdoc3: item[18],
                            resource4: item[19],
                            typdoc4: item[20],
                            comment: item[22],

                            color: randomizedColor,
                            // "Useless" data to handle cross-planning UI
                            selected: false,
                            visibleStart: null,
                            visibleEnd: null,
                            slotStart: null,
                            slotEnd: null,
                            hidden: false,
                            cssClasses: [randomizedColor],
                            autoGenerated: item[10].split('+')[1]?  item[10].split('+')[1].length <= 0: true
                        });

                    }
                    // Not that important?
                    agendas.sort((a, b): number => {return a.lastName < b.lastName? -1: 1;});
                    resolve(agendas);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public static agenda_f2(natures: string[], date: Date | undefined): Promise<object[]> {
        return new Promise((resolve, reject) => {
                const agendas: Array<any> = [];
                Server.send('command=agenda_f2&p1=&p2=' + natures.join(';') + '&p3=' + jsDateToServerDate(date as Date) + ';1')
                    .then(response => {
                        const splitResponse = response.split('\n');
                        for (let i = 1; i < splitResponse.length; i++ ) {
                            const item: string[] = splitResponse[i].split(';');
                            if (item.length <= 11)  {
                                continue;
                            }
                            const idUF = item[10].split('�')[4] || "2";
                            let randomizedColor;
                            if(idUF === '598') {
                                randomizedColor = 'rose';
                            }
                            else if(idUF === '599') {
                                randomizedColor = 'vert';
                            }
                            else if(idUF === '600') {
                                randomizedColor = 'rouge';
                            }
                            else if(idUF === '700') {
                                randomizedColor = 'rose';
                            }
                            else if(idUF === '701') {
                                randomizedColor = 'vert';
                            }
                            else if(idUF === '702') {
                                randomizedColor = 'rouge';
                            }
                            else if(idUF === '703') {
                                randomizedColor = 'bleu';
                            }
                            else {
                                randomizedColor = 'bleu';
                            }

                            item[22] = item[22] && item[22].length? item[22].replace('�', ''): '';
                            agendas.push({
                                civility: item[0],
                                firstName: item[1],
                                lastName: item[2],
                                beginDate: item[3],
                                endDate: item[5],
                                motive: item[7],
                                type: item[9],
                                status: item[10].split('+')[0].split('�')[0],
                                id: item[10].split('+')[1] || uuidv4(),
                                optimalEndDate: item[10].split('�')[2] || null, // according to PMSI?
                                birthDate: item[10].split('�')[5],
                                age: (new Date().getFullYear() - new Date(item[10].split('�')[5]).getFullYear()) || undefined,
                                resourceId: item[11],
                                resource1: item[13],
                                typdoc1: item[14],
                                resource2: item[15],
                                typdoc2: item[16],
                                resource3: item[17],
                                typdoc3: item[18],
                                resource4: item[19],
                                typdoc4: item[20],
                                comment: item[22],

                                color: randomizedColor,
                                // "Useless" data to handle cross-planning UI
                                selected: false,
                                visibleStart: null,
                                visibleEnd: null,
                                slotStart: null,
                                slotEnd: null,
                                hidden: false,
                                cssClasses: [randomizedColor],
                                autoGenerated: item[10].split('+')[1]?  item[10].split('+')[1].length <= 0: true
                            });

                        }
                        // Not that important?
                        agendas.sort((a, b): number => {return a.lastName < b.lastName? -1: 1;});
                        resolve(agendas)
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        );
    }

    /**
     * Should be connected with Cyril account to be allowed to do that.
     * Let's build a query looking like the following:
     *
     * dictee.zenidoc.com:9000/portail.iz?DoCommand?logon=b388833ee458a646570975eb9bb5d49d&command=agenda_creationrdv&p1=&p2=41&p3=IPP_007;idUF_0;IdService_196;IdTypedoc_1;TypeExamen_test;NoDossier_123456;Civilite_M;Nom_BOND;Prenom_James;sexe_M;Date_24/11/2019;Debut_24/11/2019 12:00;Fin_24/11/2019 13:00;motif_ablation;commentaire_test insertion;ressources_4
     * dictee.zenidoc.com:9000/portail.iz?DoCommand?logon=b388833ee458a646570975eb9bb5d49d&command=agenda_creationrdv
     *     &p1=
     *     &p2=41
     *     &p3=IPP_007;
     *         idUF_0;
     *         IdService_196;                  << service de plannification
     *         IdTypedoc_1604;
     *         TypeExamen_Public;                << chaine de caratères
     *         NoDossier_123456;
     *         Civilite_M;
     *         Nom_BOND;
     *         Prenom_James;
     *         sexe_M;
     *         Date_24/11/2019;
     *         Debut_24/11/2019 12:00;
     *         Fin_24/11/2019 13:00;
     *         motif_ablation;
     *         commentaire_test insertion;
     *         ressources_Salles                   <<
     */
    public static agenda_creation_rdv(availability: any, patient: any, motive: any): Promise<object[]> {

        const date = jsDateToFrenchServerDate(new Date(new Date(availability.isoDate).getTime() + 1000 * 60 * 60 * 4));                 //.toString().replace('T', ' ');
        const dateDebut = jsDateToFrenchServerDate(new Date(availability.isoDate), true);                                               //.toString().replace('T', ' ');
        const dateFin = jsDateToFrenchServerDate(new Date(new Date(availability.isoDate).getTime() + 1000 * 60 * 60 * 4), true);        // .toString().replace('T', ' ');

        return Server.send(`command=agenda_creationrdv&p1=&p2=${availability.agendaId}&p3=IPP_${patient[1]};IdUF_0;IdService_196;IdTypedoc_1604;TypeExamen_Public;NoDossier_123456;Civilite_${patient[3]};NOM_${patient[4]};Prenom_${patient[5]};Sexe_${patient[3]};Date_${date};Debut_${dateDebut};Fin_${dateFin};motif_${encodeURIComponent(motive.label)};commentaire_RAS;ressources_Salles`);
    }

    public static getRessources(): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            const query = 'command=form_gettable&p1=&p2=Ressources&p3=';
            Server.send(query)
                .then((response) => {
                    const ressources: object[] = [];
                    let rows = response.split('\n');
                    rows.splice(0, 1);
                    for(const row of rows) {
                        const item = row.split('|');

                        ressources.push({
                            id: item[0] === 'NULL' ? '' : item[0],
                            label: item[1] === 'NULL' ? '' : item[1],
                            nature1: item[2] === 'NULL' ? '' : item[2],
                        });
                    }
                    resolve(ressources);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public static getAgendaLog(): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            const query = 'command=form_gettable&p1=&p2=AgendaLog&p3=';
            Server.send(query)
                .then((response) => {
                    const ressources: object[] = [];
                    let rows = response.split('\n');
                    rows.splice(0, 1);
                    for(const row of rows) {
                        const item = row.split('|');

                        ressources.push({
                            id: item[0] === 'NULL' ? '' : item[0],
                            label: item[1] === 'NULL' ? '' : item[1],
                        });
                    }
                    resolve(ressources);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Get the motives of the server and return them with their resources requirements
     */
    public static getMotives(): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            const query = 'command=form_gettable&p1=&p2=motifsTest&p3=';
            Server.send(query)
                .then((response) => {
                    const motives: object[] = [];
                    let rows = response.split('\n');
                    rows.splice(0, 1);
                    for(const row of rows) {
                        const item = row.split('|');

                        motives.push({
                            id: item[0] === 'NULL' ? '' : item[0],
                            label: item[1] === 'NULL' ? '' : item[1],
                            duration: item[2] === 'NULL' ? '' : item[2],
                            resource1: {
                                type: item[3] === 'NULL' ? '' : item[3],
                                duration: item[4] === 'NULL' ? '' : item[4]
                            },
                            resource2: {
                                type: item[5] === 'NULL' ? '' : item[5],
                                duration: item[6] === 'NULL' ? '' : item[6]
                            },
                            resource3: {
                                type: item[7] === 'NULL' ? '' : item[7],
                                duration: item[8] === 'NULL' ? '' : item[8]
                            },
                            resource4: {
                                type: item[9] === 'NULL' ? '' : item[9],
                                duration: item[10] === 'NULL' ? '' : item[10]
                            },
                            resource5: {
                                type: item[11] === 'NULL' ? '' : item[11],
                                duration: item[12] === 'NULL' ? '' : item[12]
                            },
                            resource6: {
                                type: item[13] === 'NULL' ? '' : item[13],
                                duration: item[14] === 'NULL' ? '' : item[14]
                            },
                            resource7: {
                                type: item[15] === 'NULL' ? '' : item[15],
                                duration: item[16] === 'NULL' ? '' : item[16]
                            },
                            resource8: {
                                type: item[17] === 'NULL' ? '' : item[17],
                                duration: item[18] === 'NULL' ? '' : item[18]
                            },
                            code: item[19] === 'NULL' ? '' : item[19],
                            pole: item[20] === 'NULL' ? '' : item[20],
                            service: item[21] === 'NULL' ? '' : item[21],
                            uf: item[22] === 'NULL' ? '' : item[22],
                            typeVenue: item[23] === 'NULL' ? '' : item[23],
                            details: item[24] === 'NULL' ? '' : item[24],
                            modelWord: item[25] === 'NULL' ? '' : item[25],
                            deprg: item[26] === 'NULL' ? '' : item[26],
                            uf1: item[27] === 'NULL' ? '' : item[27],
                            uf2: item[28] === 'NULL' ? '' : item[28],
                            matchingSearch: false,
                        });
                    }
                    resolve(motives)
                })
                .catch((error) => {
                    reject(error)
                });
        });
    }


    /**
     * Create new motif
     * @param UF selected UF label
     * @param service service label bind to this UF
     * @param pole pole label bind to this service
     */
    public static addMotif(UF: any, service: any, pole: any): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            //p2=nomdetable,col2,col3,... p3='val2'[,'val3'[,etc...]]
            const query = "command=form_addline&p1=&p2=motifsTest,Libelle,Duree1,UF,Service,Pole&p3='NouveauMotif','24h','"+UF+"','"+service+"','"+pole+"'";
            Server.send(query)
                .then(response => {resolve(response)})
                .catch(error => {reject(error)})
        });
    }

    /**
     * Read motives  
     * @param column table's field name
     * @param value searched value
     */
    public static getLine(column: any, value: any): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            // p2=nomdetable,col1=val1
            const query = "command=form_getline&p1=&p2=motifsTest,"+column+"='"+value+"'&p3=";
            Server.send(query)
                .then((response) => {
                    const motives: object[] = [];
                    let rows = response.split('\n');
                    rows.splice(0, 1);
                    for(const row of rows) {
                        const item = row.split('|');

                        motives.push({
                            id: item[0] === 'NULL' ? '' : item[0],
                            label: item[1] === 'NULL' ? '' : item[1],
                            duration: item[2] === 'NULL' ? '' : item[2],
                            resource1: {
                                type: item[3] === 'NULL' ? '' : item[3],
                                duration: item[4] === 'NULL' ? '' : item[4]
                            },
                            resource2: {
                                type: item[5] === 'NULL' ? '' : item[5],
                                duration: item[6] === 'NULL' ? '' : item[6]
                            },
                            resource3: {
                                type: item[7] === 'NULL' ? '' : item[7],
                                duration: item[8] === 'NULL' ? '' : item[8]
                            },
                            resource4: {
                                type: item[9] === 'NULL' ? '' : item[9],
                                duration: item[10] === 'NULL' ? '' : item[10]
                            },
                            resource5: {
                                type: item[11] === 'NULL' ? '' : item[11],
                                duration: item[12] === 'NULL' ? '' : item[12]
                            },
                            resource6: {
                                type: item[13] === 'NULL' ? '' : item[13],
                                duration: item[14] === 'NULL' ? '' : item[14]
                            },
                            resource7: {
                                type: item[15] === 'NULL' ? '' : item[15],
                                duration: item[16] === 'NULL' ? '' : item[16]
                            },
                            resource8: {
                                type: item[17] === 'NULL' ? '' : item[17],
                                duration: item[18] === 'NULL' ? '' : item[18]
                            },
                            code: item[19] === 'NULL' ? '' : item[19],
                            pole: item[20] === 'NULL' ? '' : item[20],
                            service: item[21] === 'NULL' ? '' : item[21],
                            uf: item[22] === 'NULL' ? '' : item[22],
                            typeVenue: item[23] === 'NULL' ? '' : item[23],
                            details: item[24] === 'NULL' ? '' : item[24],
                            modelWord: item[25] === 'NULL' ? '' : item[25],
                            deprg: item[26] === 'NULL' ? '' : item[26],
                            uf1: item[27] === 'NULL' ? '' : item[27],
                            uf2: item[28] === 'NULL' ? '' : item[28],
                            matchingSearch: true,
                        });
                    }
                    resolve(motives)
                })
                .catch((error) => {
                    reject(error)
                });
        });
    }

    public static updateMotif(id: any, column: any, value: any): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            //p2=nomdetable,col1=val1 p3=col2='val2'[,col3='val3'[,etc]]
            //p2=motifs,id=12&          p3=UF2='/OTONEURO'
            const query = "command=form_setline&p1=&p2=motifsTest,idMotif="+id+"&p3="+column+"='"+value+"'";
            Server.send(query)
                .then(response => {resolve(response)})
                .catch(error => {reject(error)})
        })
    }

    /**
     * Delete selected motif
     * @param idMotif selected motif id
     */
    public static deleteMotif(idMotif: any): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            //p2=nomdetable,col1=val1
            const query = 'command=form_deleteline&p1=&p2=motifsTest,IdMotif='+idMotif+'&p3=';
            Server.send(query)
                .then(response => {resolve(response)})
                .catch(error => {reject(error)})
        })
    }

    /**
     * For a given motive, provide the resources lists composition for form definition.
     * Response content as JSON, can be returned without any parsing
     */
    public static agenda_getMotiveResourcesLists(motive: any): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            Server.send('command=agenda_get-resources-list&p1&p2=' + motive)
                .then(response => {resolve(response)})
                .catch(error => {reject(error)})
        });
    }

    private static serverAgendaF1toJson(rawData: string) {
        const jsonObjects = [];
        let jsonObject = {};
        const rows = rawData.split('\n');
        let items = [];
        for (const row of rows) {
            jsonObject = {};
            if (row.length > 0) {
                items = row.split(';');
                (jsonObject as any).label = items[0];
                (jsonObject as any).id = items[1].replace(/[^0-9]/g, '');
                (jsonObject as any).settings = items[2];
                (jsonObject as any).color = items[3];
                jsonObjects.push(jsonObject);
            }
        }
        return jsonObjects;
    }


    public static client_gethistoedi(): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            const query = 'command=client_gethistoedi&p1=&p2=&p3=';
            const parsedResponse: object[] = [];
            Server.send(query)

                .then((response) => {
                    let rows = response.split('\n');
                    rows.splice(0, 2);
                    for(let row of rows) {
                        if (row.length < 10) {
                            continue;
                        }
                        const object = row.split('|');
                        parsedResponse.push({
                            id: object[0] === 'NULL' ? null : object[0],
                            sendingDate: object[1] === 'NULL' ? null : object[1].split(' ')[0],
                            patient: object[2] === 'NULL' ? null : object[2] + ' ' + object[3],
                            IPP: object[3] === 'NULL' ? null : object[4],
                            birthDate: object[4] === 'NULL' ? null : object[5].split(' ')[0],
                            recipientLabel: object[5] === 'NULL' ? null : object[6] + ' ' + object[7],
                            recipientId: object[6] === 'NULL' ? null : object[8],
                            recipientMail: object[7] === 'NULL' ? null : object[9],
                            service: object[8] === 'NULL' ? null : object[10],
                            sendingType: object[9] === 'NULL' ? null : object[11],
                            trackingId: object[10] === 'NULL' ? null : object[12],
                            hasResponse: object[11] === 'NULL' ? null : object[13],
                            responseDate: object[12] === 'NULL' ? null : object[14].split(' ')[0],
                            documentName: object[13] === 'NULL' ? null : object[15],
                            attachement: object[14] === 'NULL' ? null : object[16],
                            matchingSearch: true,
                        });
                    }
                    resolve(parsedResponse);
                });

        })
    }

    public static getVisuarb(ipp: string, typeArbo:any) :  Promise<object[]> {
        // TODO : gérer plus tard le choix entre api interne et api externe
        if(true) return this.getVisuarbExterne(ipp, typeArbo);
        else return this.getVisuarbZenidoc(ipp, typeArbo.title);
    }

    public static getVisuarbExterne (ipp: string, typeArbo: any) : Promise<object[]> {
        return new Promise((resolve, reject) =>{
            let query: string = 'http://10.18.52.31:8080/EmrKeysDoc/DBconnection_getDocumentsFromPatientID.php?patid=101897395';
            apiExterne.send(query)
            
            .then((response: any[]) => {
                //console.log(response)
                let treeNodes = response;
                let gp: any;
                let currentNode: any;
                let childrenNode: any;
                let root : any = {
                    "label": "Toto",
                    "path": "Root",
                    "other": "",
                    "image": "Folder",
                    "couleur": "Vert",
                    "style": "Normal",
                    "provenance": "ApiExterne",
                    "children": []
                };
                if(typeArbo.path.includes("+")){
                    typeArbo.path.replace("+","")
                }
                console.log(typeArbo.title)
                console.log(typeArbo.path)
                for (let i = 0; i < treeNodes.length; i++ ) {                   
                    let parent = null;              
                    currentNode = {
                        "label": treeNodes[i][typeArbo.path],
                        // "label": treeNodes[i].LASTNAME + " " + treeNodes[i].FIRSTNAME + " " + treeNodes[i].DOCDATE + " " + treeNodes[i].DOCTYP,
                        "path": treeNodes[i].DOCADR,
                        "other": treeNodes[i],
                        "image": "Paper",
                        "couleur": "Blanc",
                        "style": "Normal",
                        "provenance": "ApiExterne",
                        "children": []
                    }
                    // root.children.push(currentNode);
                    root.children.forEach(function(value,i1){
                        if(value.label==treeNodes[i].DOCTYP){
                            value.children.forEach(function(value1,i2){
                                if(value1.docDate==treeNodes[i].DOCDATE){
                                    parent=value1;
                                }
                            })
                            if(parent==null){
                                parent = {
                                    "label": treeNodes[i].DOCDATE,
                                    "path": "_d2",
                                    "image": "Folder",
                                    "couleur": "Jaune",
                                    "style": "Normal",
                                    "children": []
                                };
                            value.children.push(parent);
                            }
                        }
                    });
                    if(parent==null){
                        gp = {
                            "label": treeNodes[i].DOCTYP,
                            "path": "_d1",
                            "image": "Folder",
                            "couleur": "Jaune",
                            "style": "Normal",
                            "children": []
                        }
                        parent = {
                            "label": treeNodes[i].DOCDATE,
                            "path": "_d2",
                            "image": "Folder",
                            "couleur": "Jaune",
                            "style": "Normal",
                            "children": []
                        }
                        gp.children.push(parent)
                        root.children.push(gp)
                    }
                    parent.children.push(currentNode);
                }
                //console.log(root)
                resolve(root);
            })
        })
    }


    public static getVisuarbZenidoc (ipp: string, typeArbo: any) : Promise<object[]> {
        return new Promise((resolve, reject) => {
            let query: string = 'command=visuarb_gettree&p1=&p2=' + ipp + '&p3=' + typeArbo;
            // let query: string = 'command=client_getvisuarb&p1=&p2=&p3=';
            Server.send(query)
            .then((response: string) => {
                // Idée de l'algo :
                // Pour chaque ligne du fichier on initialise un nouveau noeud (currentNode)
                // On regarde où le placer en fonction du nombre n de tabulations :
                //  - si plus de tabulations qu'avant, c'est l'enfant du dernier noeud considéré
                //  - si moins ou autant de tabulations qu'avant, c'est l'enfant du dernier noeud avec n-1 tabulations
                // La racine est le premier noeud récupéré, le seul avec 0 tabulations.
                const treeNodes = response.split('\n');
                let root: any;
                let currentNode: any;
                // Cette variable permet de conserver les derniers noeuds de chaque niveau précédent
                // Elle contient la généalogie des noeuds de niveaux plus grands
                // Pour avoir la généalogie de noeuds de niveaux égaux ou plus faibles, il suffit d'enlever le bon nombre d'éléments
                // La position d'un noeud dans ce tableau est équivalente au nombre de tabulations présentes sur la ligne associée
                let tabParents: any[] = new Array<any>();
                // Format d'une ligne : \t*label|type|image|couleur|style
                for (let i = 1; i < treeNodes.length; i++ ) {
                    treeNodes[i].replace('�', 'é');
                    if (treeNodes[i].length > 0) {
                        const items: string[] = treeNodes[i].split('|');
                        const tabsSlices: string[] = items[0].split('\t');
                        const numberOfTabs: number = tabsSlices.length - 1;
                        currentNode = {
                            "label": tabsSlices[tabsSlices.length - 1].replace(/�/g, 'é'),
                            "path": items[1],
                            "image": items[2],
                            "couleur": items[3],
                            "style": items[4].trim(),
                            "children": []
                        }
                        // 0 tabulations --> root
                        if(numberOfTabs == 0) root = currentNode;
                        else {
                            let tabParentsLength: number = tabParents.length;
                            // Si moins ou autant de tabulations qu'avant, on enlève les noeuds qui ne font pas partie de l'ascendance du noeud courant
                            if (numberOfTabs < tabParentsLength){
                                for(let i = 0; i < tabParentsLength - numberOfTabs; i++){
                                    tabParents.pop();
                                }
                            }
                            // Le dernier noeud du tableau des parents est le père du noeud courant
                            tabParents[tabParents.length - 1].children.push(currentNode);
                        }
                        // Ajout du noeud courant au tableau des parents pour pouvoir ajouter ses enfants
                        tabParents.push(currentNode);

                    }
                }
                //console.log(root as object)
                resolve(root);
            })
        })
    }

    public static client_getvisuarbini(): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            const query = 'command=client_getvisuarbini&p1=&p2=&p3=';
            const parsedResponse: object[] = [];
            Server.send(query)
                .then((reponse) => {
                    let rows = reponse.split('\n');

                    let state = '';
                    let item;
                    for (let i=0; i < rows.length; i++) {
                        item = rows[i].trim(); // toujours problème avec \r en fin de ligne
                        if (item === '[Paramètres]') {
                            state = 'parameters';
                            
                        } else if (item === '[Menus]') {
                            state = 'menus';

                        } else if (item === '[Rechercher]') {
                            state = 'research';

                        } else if (item === '[Couleurs]') {
                            state = 'colors';

                        } else if (item === '[Couleurs feuilles]') {
                            state = 'sheetsColors';

                        } else if (item === '[Modifier]') {
                            state = 'modify';

                        } else if (item === '[Listesdocs]') {
                            state = 'docsLists';

                        } else if (item === '[Modeles]') {
                            state = 'models'; 

                        } else if (item === '[Arbres]') {
                            state = 'trees';

                        } else if (state !== "") {
                            if (state === 'menus') {
                                var regexp = /^;/g; // lignes qui commencent par ";" = commentaire
                                // Si rows ne commence pas par ";" alors on peut récupérer la ligne
                                if (!rows[i].match(regexp) && rows[i].length > 2) {                                    
                                    let menus = []; 
    
                                    // category=subcategory|subcategory|...
                                    let category = item.split('=')[0];
                                    //console.log(category)
                                    let subcategories = item.split('=')[1];
                                    //console.log(subcategories)
                                    let subtitles = subcategories.split('|');
                                    //console.log(subtitles)
    
                                    menus.push(
                                        category,
                                        subtitles
                                    );
    
                                    parsedResponse.push({
                                        menus: menus
                                    })

                                }
                            } 
                        }
                    }
                    resolve(parsedResponse);
                });
        });
    }

    public static visuarbc_getfile(filePath: any): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            const query = 'command=visuarbc_getfile&p1=&p2=' + filePath + '&p3=';
            Server.send(query)
                .then((response) => {
                    let path = response.split('\n');
                    path.splice(0, 1);
                    resolve(path);
                })
                .catch(error => {reject(error)})
        });
    }

    public static visuarbc_getcbo(): Promise<object[]> {
        // TODO : gérer plus tard choix entre api interne et api externe
        if(true) return this.visuarbc_getcbo_zenidoc('command=visuarb_getcbo2&p1=&p2=&p3=');
        else return this.visuarbc_getcbo_zenidoc('command=visuarbc_getcbo&p1=&p2=&p3=');
    }

    public static visuarbc_getcbo_zenidoc(query: string): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            const parsedResponse: object[] = [];
            Server.send(query)
                .then((response) => {
                    //console.log(response)
                    let rows = response.split('\n');
                    rows.splice(0, 1);
                    let item;
                    let trees = [];
                    for (let i = 0; i < rows.length ; i++) {
                        item = rows[i].trim();
                        if (item.length > 0) {
                            trees.push(item);
                        }
                    }

                    let listArbo = [];
                    let treeObject = {title: "", path: "", levels: [] as any};                    
                    let arbo;
                    for (let i = 0 ; i < trees.length ; i++) {
                        item = trees[i];
                        if (item.includes(';')) {                                
                            arbo = Object.create(treeObject);
                            arbo.title = item.split(';')[0];
                            arbo.path = item.split(';')[1];
                            arbo.levels = [];

                            listArbo.push(arbo);
                        } else {
                            let level;
                            // Remove '='
                            if (item.indexOf('=') != -1) {
                                level = item.substring(0, item.length -1);                                
                            }
                            let index = listArbo.length - 1;
                            listArbo[index].levels.push(level);
                        }

                    }

                    parsedResponse.push({
                        arborescences: listArbo
                    })

                    resolve(parsedResponse);
                })
        });
    }

    public static visuarbc_deletecbo(): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            const query = 'command=visuarbc_deletecbo&p1=&p2=&p3=';
            Server.send(query)
                .then(response => {resolve(response)})
                .catch(error => {reject(error)})
        })
    }

    public static visuarbc_addcboline(line: any): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            const query = 'command=visuarbc_addcbolinea&p1=&p2=' + line + '&p3=';
            Server.send(query)
                .then(response => {resolve(response)})
                .catch(error => {reject(error)})
        });
    }

    /**
     * Récupération des méta type doc
     */
    public static client_getalltypedocmeta(): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            const query = 'command=client_getalltypedocmeta&p1=&p2=&p3=';
            const parsedResponse: object[] = [];
            Server.send(query)
                .then((response) => {
                    let rows = response.split('\n');
                    rows.splice(0, 2);

                    for(let row of rows) {
                        if (row.length < 10) { // ??? pas compris
                            continue;
                        }
                        const object = row.split('|');
                        parsedResponse.push({
                            id: object[0] === 'NULL' ? null : object[0],
                            label: object[1] === 'NULL' ? null : object[1],
                            serviceId: object[2] === 'NULL' ? null : object[2],
                        });
                    }
                    resolve(parsedResponse);
                })
        });
    }

    /**
     *
     * @param typeDocId id du type doc recherché
     * @param dateFrom date sélectionnée dans app.protocolisation/Header.vue (valeur par défaut 01/01/1970)
     * @param dateTo date sélectionnée dans app.protocolisation/Header.vue (valeur par défaut aujourd'hui)
     */
    public static client_getexamensinprotocole(typeDocId: number, dateFrom: Date, dateTo: Date): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            const query = 'command=client_getexamensinprotocole&p1=&p2='+typeDocId+'&p3='+dateFrom+';'+dateTo;
            const parsedResponse: object[] = [];
            Server.send(query)
                .then((response) => {
                    let rows = response.split('\n');
                    const tableHeaders = rows[1].split(';');
                    const headers = [];
                    for (let i = 0; i < tableHeaders.length ; i++) {
                        headers.push(tableHeaders[i]);
                    }

                    parsedResponse.push({
                        headers: headers
                    });

                    rows.splice(0, 2);
                    // window.console.log('coucou', rows);
                    for(let row of rows) {
                        if (row.length < 10) {
                            continue;
                        }
                        const object = row.split(';');
                        parsedResponse.push({
                            ipp: object[0] === 'NULL' ? null : object[0],
                            iep: object[1] === 'NULL' ? null : object[1],
                            nom: object[2] === 'NULL' ? null : object[2],
                            prenom: object[3] === 'NULL' ? null : object[3],
                            typedoc1: object[4] === 'NULL' ? null : object[4],
                            typedoc2: object[5] === 'NULL' ? null : object[5],
                            typedoc3: object[6] === 'NULL' ? null : object[6],
                            matchingSearch: true,
                        });
                    }
                    resolve(parsedResponse);
                });

        })

    }

    public static client_getall(): Promise<object[]> {
        return new Promise((resolve, reject) => {
            const query = 'command=client_getall&p1=&p2=&p3=';
            const parsedResponse: object[] = [];
            Server.send(query) // send query to server as cached file

                .then((response) => {
                    let rows = response.split('\n');
                    rows.splice(0, 1);
                    // window.console.log('test', rows);

                    let state = '';
                    let item;
                    for (let i = 0 ; i < rows.length ; i++) {
                        item = rows[i];
                        if (item === "%Services%") {
                            state = 'services';
                            var servicesIndex = i;

                        } else if (item === "%Auteurs%") {
                            state = "authors";
                            var authorsIndex = i;

                        } else if (item === "%UFs%") {
                            state = 'ufs';

                        } else if (item === "%Secretaires%") {
                            state = 'secretaries';

                        } else if (item === "%Autorisations auteurs%") {
                            state = "authorsAuthorizations";

                        } else if (item === "%Autorisations secretaires%") {
                            state = "secretariesAuthorizations";

                        } else if (item === '%Typedocs%') {
                            state = "docTypes";

                        } else if (item === "%Poles%") {
                            state = "poles";

                        } else if (item === "%Etablissements%") {
                            state = "establishments";

                        } else if (item === "%Urgence%") {
                            state = "urgences";

                        } else if (item === "%Etapes%") {
                            state = "etapes";

                        } else if (state !== "") {
                            if (state === 'services') {
                                let services = [];

                                // label | id | PolesId
                                let label = item.split('|')[0];
                                let id =  item.split('|')[1];
                                let polesId = item.split('|')[2];

                                services.push(
                                    label,
                                    id,
                                    polesId
                                );

                                parsedResponse.push({
                                    services: services
                                });
                            } else if (state === 'authors') {
                                let authors = [];

                                // name | id
                                let name = item.split('|')[0];
                                let id = item.split('|')[1];
                                authors.push(
                                    name,
                                    id
                                );

                                parsedResponse.push({
                                    authors: authors
                                });

                            } else if (state === 'ufs') {
                                // Unités de fonctionnement
                                let ufs = [];

                                // idUFExterne/label | id | serviceId
                                let label = item.split('|')[0];
                                let id = item.split('|')[1];
                                let serviceId = item.split('|')[2];
                                ufs.push(
                                    label,
                                    id,
                                    serviceId
                                );

                                parsedResponse.push({
                                    ufs: ufs
                                });

                            } else if (state === 'secretaries') {
                                let secretaries = [];

                                // name | id
                                let name = item.split('|')[0];
                                let id = item.split('|')[1];
                                secretaries.push(
                                    name,
                                    id
                                );

                                parsedResponse.push({
                                    secretaries: secretaries
                                });

                            } else if (state === 'docTypes') {
                                let docTypes = [];

                                // label | id | serviceId
                                let label = item.split('|')[0];
                                let id =  item.split('|')[1];
                                let serviceId = item.split('|')[2];

                                docTypes.push(
                                    label,
                                    id,
                                    serviceId
                                );

                                parsedResponse.push({
                                    docTypes: docTypes
                                });

                            } else if (state === 'poles') {
                                let poles = [];

                                // label | id | establishmentsId
                                let label = item.split('|')[0];
                                let id =  item.split('|')[1];
                                let establishmentsId = item.split('|')[2];

                                poles.push(
                                    label,
                                    id,
                                    establishmentsId
                                );

                                parsedResponse.push({
                                    poles: poles
                                });

                            } else if (state === 'establishments') {
                                let establishments = [];

                                // label | id
                                let name = item.split('|')[0];
                                let id = item.split('|')[1];
                                establishments.push(
                                    name,
                                    id
                                );

                                parsedResponse.push({
                                    establishments: establishments
                                });

                            } else if (state === 'authorsAuthorizations') {
                                let authorsAuthorizations = [];

                                // serviceId | authorId
                                let serviceId = item.split('|')[0];
                                let authorId = item.split('|')[1];
                                authorsAuthorizations.push(
                                    serviceId,
                                    authorId
                                );

                                parsedResponse.push({
                                    authorsAuthorizations: authorsAuthorizations
                                });

                            } else if (state === 'secretariesAuthorizations') {
                                let secretariesAuthorizations = [];

                                // serviceId | secretarieId
                                let serviceId = item.split('|')[0];
                                let secretarieId = item.split('|')[1];
                                secretariesAuthorizations.push(
                                    serviceId,
                                    secretarieId
                                );

                                parsedResponse.push({
                                    secretariesAuthorizations: secretariesAuthorizations
                                });
                            }
                        }

                    }

                    resolve(parsedResponse);
                });


        });
    }

    public static client_getWorkList(): Promise<object[]> {
        return new Promise<object[]>((resolve, reject) => {
            Server.send('command=client_getworklist&p1=&p2=')
                .then(response => {
                    const patients = [];
                    for (let row of response.split('\n')){
                        if (row.length > 4 && row.substr(0, 2) !== '||' && row.substr(0, 8) !== 'IDEXAMEN') {
                            patients.push(row.split('|'));
                        }
                    }
                    resolve(patients)
                })
                .catch(error => {reject(error)})
        });
    }








    // http://dictee.zenidoc.com/portail.iz?DoCommand?command=getcommand&p1=&p2=&p3=
    // http://dictee.zenidoc.com/portail.iz?DoCommand?command=getcommands&p1=&p2=&p3=
    /* ||command=getcommands||
    getlogon=logon de session ou (utilisateur non reconnu)   p2=username p3=password
    getusers=IdUtilisateur|Titre|Nom|Pr&eacute;nom|Logon|ProfilVocal|Id_RPPS|IdExterne|IdExterne2|IdExterne3|Obsolete
    getstations=Identit&eacute; du poste client|Status|Rapport|Rapport&eacute; le|T&eacute;l&eacute;distribution
    1=nom|pr&eacute;nom|date|lettre-etape debut-typedoc heure|idexamen|etape|definition ized (ma)
    2=nom|pr&eacute;nom|date|lettre-etape debut-typedoc heure|idexamen|etape|definition ized (mc)
    3=nom|pr&eacute;nom|date|lettre-etape debut-typedoc heure|idexamen|etape|definition ized (na)
    4=nom|pr&eacute;nom|date|lettre-etape debut-typedoc heure|idexamen|etape|definition ized (nc)
    agenda_f0=nomagd;id;options;couleur   p2=nature1;nature2;nature3;nature4 p3=nv1;nv2;... ou vide
    agenda_f1=civilite;nom;prenom;        p2=nature1;nature2;nature3;nature4 p3=date;echelledetemps
    agenda_f2=civilite;nom;prenom;        p2=nature1;nature2;nature3;nature4 p3=date;idagenda
    agenda_getallrdc=(liste %Nature%)     p2=idagenda
    agenda_creneaux=nomagd|idagenda|dt|d  p2=idagenda p3=nom_val;nom_val;etc...
    adminplus_readuser=titre;nom;etc..    p2=idutilisateur
    adminplus_archives=dates des profils  p2=idutilisateur
    adminplus_createuser=ok ou msg
    adminplus_edituser=ok ou msg          p2=iduser
    client_getall=(reponse similaire au header des .dat de comptagezip)
    client_action=ok ou erreur            p2=annuler;idexamen ou desannuler;idexamen
    client_getworklist=(reponse similaire a 1 2 3 4)
    TODO client_pilotage=(reponse similaire a 1 2 3 4)
    TODO client_open=finir/pause/annuler  p2=idexamen       p3=etape
    TODO client_setfilters=ok ou erreur   p2=nom1=valeur1;nom2=valeur2;etc...
    TODO form_gettable=colonne1=valeurs1; p2=nomtable
    TODO form_addline=ok ou erreur                          p3=colonne1 = valeurs1; etc
    TODO form_setline=ok ou erreur        p2=valeur de l'id p3=colonne1=valeurs1;etc
    TODO form_deleteline=ok ou erreur     p2=valeur de l'id
    19 command(s)
     */
}

// Hack: function proposed to generate fake id for autogenerated events
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}