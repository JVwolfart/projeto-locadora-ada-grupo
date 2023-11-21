import { Cliente } from "../Cliente";
import { Veiculo } from "../Veiculo";

function validaVeiculoParaBaixa(veiculo: Veiculo){
    if(!veiculo){
        return false;
    } else if(veiculo.baixado){
        return false;
    } else if(veiculo.alugadoPara !== null){
        return false;
    } else {
        return true;
    }
}

function validaClienteParaDesativar(cliente: Cliente){
    if(!cliente){
        return false;
    } else if(!cliente.ativo){
        return false;
    } else if(cliente.veiculoAlugado !== null){
        return false;
    } else {
        return true;
    }
}

function validaVeiculoParaReativar(veiculo: Veiculo){
    if(!veiculo){
        return false;
    } else if(!veiculo.baixado){
        return false;
    } else {
        return true;
    }
}

function validaClienteParaReativar(cliente: Cliente){
    if(!cliente){
        return false;
    } else if(cliente.ativo){
        return false;
    } else {
        return true;
    }
}

export {validaVeiculoParaBaixa, validaClienteParaDesativar, validaVeiculoParaReativar, validaClienteParaReativar}