import { TipoCarteira } from "../TipoCarteira";

class TipoVeiculo {
    static idTipoVeiculo: number = 1;
    id: number;
    tipo: string;
    acrescimo: number;
    tipoCarteira: TipoCarteira;

    constructor (tipo: string, acrescimo: number, tipoCarteira: TipoCarteira){
        this.id = TipoVeiculo.idTipoVeiculo++;
        this.tipo = tipo.toUpperCase();
        this.acrescimo = acrescimo;
        this.tipoCarteira = tipoCarteira;
    }
}

export {TipoVeiculo}