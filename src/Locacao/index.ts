class Locacao {
    static idLocacao: number = 1;
    id: number;
    idCliente: number;
    idVeiculo: number;
    dataLocacao: Date;
    dataPrevistaDevolucao: Date;
    dataDevolucao: Date | null;
    nDias: number | null;
    valorDiaria: number | null;
    acrescimo: number | null;
    finalizado: boolean;

    constructor(idCliente: number, idVeiculo: number, dataLocacao: Date, dataPrevistaDevolucao: Date){
        this.id = Locacao.idLocacao++;
        this.idCliente = idCliente;
        this.idVeiculo = idVeiculo;
        this.dataLocacao = dataLocacao;
        this.dataPrevistaDevolucao = dataPrevistaDevolucao;
        this.dataDevolucao = null;
        this.nDias = null;
        this.valorDiaria = null;
        this.acrescimo = null;
        this.finalizado = false;
    }

    
}

export {Locacao}