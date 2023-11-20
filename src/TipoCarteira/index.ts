class TipoCarteira {
    static tipoCarteiraId: number = 1;
    id: number;
    tipo: string;
    descricao: string;
    constructor (tipo: string, descricao: string) {
        this.id = TipoCarteira.tipoCarteiraId++;
        this.tipo = tipo.toUpperCase();
        this.descricao = descricao;
    }
}

export {TipoCarteira}