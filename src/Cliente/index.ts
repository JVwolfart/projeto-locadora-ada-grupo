import { TipoCarteira } from "../TipoCarteira";

class Cliente {
    static idCliente = 1;
    id: number
    nome: string;
    cpf: string;
    tipoCarteira: TipoCarteira;
    veiculoAlugado: number | null;
    historico: number[];
    ativo: boolean;

    constructor(nome: string, cpf: string, tipoCarteira: TipoCarteira){
        this.id = Cliente.idCliente++;
        this.nome = nome;
        this.cpf = cpf;
        this.tipoCarteira = tipoCarteira;
        this.veiculoAlugado = null;
        this.historico = [];
        this.ativo = true;
    }

}

export {Cliente}