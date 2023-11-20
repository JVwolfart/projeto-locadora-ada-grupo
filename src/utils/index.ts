import { Cliente } from "../Cliente";
import { Locacao } from "../Locacao";
import { Veiculo } from "../Veiculo";

function formataCPF(cpf: string){
    return cpf.slice(0, 3) + "." + cpf.slice(3, 6) + "." + cpf.slice(6, 9) + "-" + cpf.slice(9);
}

function validaCPF(cpf: string){
    return cpf.length === 11 && /^\d+$/.test(cpf);
}

function validaData(dataStr: string){
    const regexData = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
    const data = dataStr.split("/");
    const mesesCom31 = [1, 3, 5, 7, 8, 10, 12];
    const mesesCom30 = [4, 6, 9, 11];
    if(data.length !== 3){
        return false;
    }
    if(parseInt(data[1]) > 12){
        return false;
    }
    if(anoBissexto(parseInt(data[2]))){
        if (parseInt(data[1]) === 2 && parseInt(data[0]) > 29){
            return false;
        }
    }
    if(!anoBissexto(parseInt(data[2]))){
        if (parseInt(data[1]) === 2 && parseInt(data[0]) > 28){
            return false;
        }
    }
    if(mesesCom30.includes(parseInt(data[1]))  && parseInt(data[0]) > 30){
        return false;
    }
    if(mesesCom31.includes(parseInt(data[1]))  && parseInt(data[0]) > 31){
        return false;
    }
    if(!regexData.test(dataStr)){
        return false;
    }
    return true;
}

function strPData(dataStr: string){
    const data = dataStr.split("/");
    return new Date(`${data[2]}-${data[1]}-${data[0]}`)
}

function anoBissexto(ano: number){
    if(ano % 4 !== 0){
        return false;
    } else if (ano % 400 === 0){
        return true;
    } else if(ano % 100 === 0){
        return false;
    } else if(ano % 4 === 0){
        return true;
    }
}

function calculaNDias(dataInicial, dataFinal){
    return (dataFinal-dataInicial)/ 1000 / 60 / 60 / 24;
}

function formataData(data: Date) {
    let dataStr = data.toISOString();
    let dataFormatada = dataStr.slice(8, 10) + "/" + dataStr.slice(5, 7) + "/" + dataStr.slice(0, 4);
    return dataFormatada;
}

/*function formataData1(data: Date){
    /*let dataStr = data.toISOString();
    let dataFormatada = dataStr.slice(8, 10) + "/" + dataStr.slice(5, 7) + "/" + dataStr.slice(0, 4);
    console.log(dataFormatada);
}*/

function gerarFatura(fatura: Locacao, cliente: Cliente, veiculo: Veiculo){
    let totalDiarias = veiculo.valorDiaria*fatura.nDias;
    let acrescimos = (totalDiarias*((veiculo.tipoVeiculo.acrescimo/100)))
    let totalFatura = totalDiarias+acrescimos;
    console.log(
   `
    ${"*****************************************************************************"}
    ${"*************      SISTEMA RENT A CAR EMISSÃO DE FATURA     *****************"}
    ${"*****************************************************************************"}

                                ${'DADOS DA LOCAÇÃO'.underline.yellow}

    Nº da fatura: ${fatura.id.toString().red}
    Data da locação: ${formataData(fatura.dataLocacao).blue}
    Data da devolução: ${formataData(fatura.dataDevolucao).blue}
    Quantidade de dias da locação: ${fatura.nDias.toString().blue}
    Veículo alugado: ${veiculo.modelo.blue}
    Valor da diária: ${`R$ `.blue + veiculo.valorDiaria.toFixed(2).blue}
    Placa do veículo: ${veiculo.placa.blue}
    --------------------------------------------------------------------------------

                              ${'DADOS DO CLIENTE'.underline.yellow}
    
    Nome do cliente: ${cliente.nome.blue}
    CPF do cliente: ${cliente.cpf.blue}
    Tipo de habilitação: ${cliente.tipoCarteira.tipo.blue}
    --------------------------------------------------------------------------------

                            ${'CÁLCULO DOS VALORES'.underline.yellow}

    Valor da diária.......................................R$${veiculo.valorDiaria.toFixed(2).padStart(9)}
    Quantidade de dias....................................X ${fatura.nDias.toString().padStart(9).underline}
    Total das diárias.....................................R$${totalDiarias.toFixed(2).padStart(9)}
    Acréscimo referente a impostos do tipo de veículo.....X ${`${veiculo.tipoVeiculo.acrescimo}%`.padStart(9).underline}
    Total do acréscimo....................................R$ ${("+" + acrescimos.toFixed(2).padStart(7)).underline}
    Valor total da fatura.................................R$${totalFatura.toFixed(2).padStart(9)}
    
    
    --------------------------------------------------------------------------------
                        RENT A CAR AGRADECE A PREFERÊNCIA
    --------------------------------------------------------------------------------
                        `);
}

export {formataCPF, validaCPF, validaData, strPData, calculaNDias, formataData, gerarFatura}