/**
 * Promise based API for Zenchat.
 */
import Axios from 'axios';
import Store from '@/store';

export default class ZenchatAPI {

    public static Settings: object = (Store as any).Settings;
    public static baseUrl: string = (Store as any).Settings.apis.zenchat.baseURL;

    /**
     * Send a one-shot message to a given Zenchat server
     */
    public static sendMessage(login: string, password: string, recipient: string, message: string): Promise<object> {

        return new Promise((resolve, reject) => {
            Axios({
                method: 'post',
                url: ZenchatAPI.baseUrl + '/api/send-message',
                headers: {
                    Login: login,
                    Password: password,
                    Recipient: recipient,
                    Message: encodeURIComponent(message),
                    Format: 'urlEncoded',
                },
            })

            .then((response) => {
                resolve(response);
            })

            .catch((response) => {
                reject(response);
            });
        });

    }
}
