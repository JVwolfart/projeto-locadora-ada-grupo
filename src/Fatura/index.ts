import { Cliente } from "../Cliente";
import { Locacao } from "../Locacao";
import { Veiculo } from "../Veiculo";
import { formataData } from "../utils";

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

export {gerarFatura}