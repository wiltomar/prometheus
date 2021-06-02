export class Criptografia {

    static PANTERAKEY = '12371233144';

    static keyGen(s: string, k: string): string {
        if (!k)
            k = this.PANTERAKEY;
        let jk = 0, js = 0;
        let resultado = '';
        for (let i = 0; i < s.length; i++) {
            jk = parseInt('0x' + k.substr(((i + 1) % k.length), 1))
            js = parseInt('0x' + s.substr(i, 1));
            resultado += (jk ^ js).toString(16);
        }
        return resultado;
    }

    static decriptoStr(v: string, k: string) {
        try {
            let s = Criptografia.keyGen(v, k);
            let resultado = '';
            for(let i = s.length; i >= 1; i--) {          
                if ((i % 2) === 1) {
                let charCode = parseInt('0x' + s.substr(i - 1, 2));
                resultado += String.fromCharCode(charCode);
                }            
            }
            return resultado;        
        } catch {
            return 'E0';
        }
    }
	
}