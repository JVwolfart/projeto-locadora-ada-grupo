import { TipoVeiculo } from "../TipoVeiculo";

class Veiculo {
    static idVeiculo: number = 1;
    id: number;
    modelo: string;
    placa: string;
    valorDiaria: number;
    tipoVeiculo: TipoVeiculo;
    disponivel: boolean;
    alugadoPara: number | null;
    baixado: boolean;
    dataUltimaLocacao: Date | null;
    dataPrevistaDevolucao: Date | null;

    constructor(modelo: string, placa: string, valorDiaria: number, tipoVeiculo: TipoVeiculo){
        this.id = Veiculo.idVeiculo++;
        this.modelo = modelo;
        this.placa = placa.toUpperCase();
        this.valorDiaria = valorDiaria;
        this.tipoVeiculo = tipoVeiculo;
        this.disponivel = true;
        this.alugadoPara = null;
        this.baixado = false;
        this.dataUltimaLocacao = null;
        this.dataPrevistaDevolucao = null;
    }
}

export {Veiculo}