export class HopperUtil {
    static getUrlParameter(sParam: string) {
        try {
            let sPageURL = window.location.search.substring(1);
            let sURLVariables = sPageURL.split('&');

            for (let i = 0; i < sURLVariables.length; i++) {
                let sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
        } catch (e) {
            return undefined;
        }
    }
}

