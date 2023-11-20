import * as readlineSync from 'readline-sync';
import * as sleep from "system-sleep"
import 'colors';
import { carregaClientes, carregaLocacoes, carregaTiposCarteira, carregaTiposVeiculo, carregaVeiculos, salvaClientes, salvaLocacoes, salvaTiposCarteira, salvaTiposVeiculo, salvaVeiculos } from './Crud';
import { Locadora } from './Locadora';
import { formataCPF, validaData, validaCPF, strPData, calculaNDias, formataData, gerarFatura, } from './utils';
var figlet = require("figlet");


const locadora = new Locadora();


try {
    carregaTiposCarteira(locadora);
    carregaTiposVeiculo(locadora);
    carregaVeiculos(locadora);
    carregaClientes(locadora);
    carregaLocacoes(locadora);
} catch (error) {
    console.log("Erro ao carregar os dados");
}

let teste = figlet.textSync(`   ${'RENT A CAR'}`, {
    font: "Standard",
    horizontalLayout: "full",
    verticalLayout: "default",
    width: 100,
    whitespaceBreak: true,

  })
console.log(teste.red);

const menu = `
    ${"*****************************************************************************".bgWhite.magenta}
    ${"*************          MENU DO SISTEMA RENT A CAR           *****************".bgWhite.magenta}
    ${"*****************************************************************************".bgWhite.magenta}

                        1 - Cadastrar tipo de carteira (JV FEITO)
                        2 - Cadastrar tipo de veículo (JV FEITO)
                        3 - Cadastrar veículo (JV FEITO)
                        4 - Cadastrar cliente (JV FEITO)
                        5 - Registrar locação (JV FEITO)
                        6 - Registrar devolução (JV FEITO)
                        7 - Emitir fatura cliente por CPF (JV FEITO)
                        8 - Emitir fatura por id (JV FEITO)
                        9 - Reativar veículo
                        10 - Reativar cliente
                        11 - Listar todos os veículos
                        12 - Listar veículos disponíveis
                        13 - Listar veículos indisponíveis (em locação)
                        14 - Listar veículos baixados (removidos)
                        15 - Listar clientes inativos (removidos)
                        16 - Remover/dar baixa em veículo
                        17 - Remover/inativar cliente
                        18 - Histórico de locações do cliente
                        0 - Sair do sistema
`



let op: number;
let voltar = "Pressione ENTER para voltar ao menu";
const hoje = new Date();

do {
    console.log(menu);
    op = parseInt(readlineSync.question("O que você deseja fazer? "));
    switch (op) {
        case 1:
            locadora.listarTiposCarteira();
            let tipoCarteira = readlineSync.question("Informe o tipo de carteira a ser cadastrado: ");
            let descricao = readlineSync.question("Informe a descrição do tipo de carteira a ser cadastrado: ")
            try {
                locadora.cadastrarTipoCarteira(tipoCarteira, descricao);
                console.log(`Carteira tipo ${tipoCarteira} cadastrada com sucesso!`);
                readlineSync.question(voltar);
            } catch (error) {
                console.log(error.message);
                readlineSync.question(voltar);
            }
            break;
        case 2:
            console.log();
            locadora.listarTiposVeiculo();
            console.log();
            let tipo = readlineSync.question("Informe o novo tipo de veículo que deseja cadastrar: ");
            let acrescimo = parseInt(readlineSync.question("Informe o percentual de acréscimo desse tipo de veículo: "));
            console.log();
            locadora.listarTiposCarteira();
            let tipoCarteiraId = parseInt(readlineSync.question("Informe o id do tipo de carteira para este tipo de veículo: "));
            try {
                locadora.cadastrarTipoVeiculo(tipo, acrescimo, tipoCarteiraId);
                readlineSync.question(`Tipo de veículo ${tipo} cadastrado com sucesso! ${voltar}`);
            } catch (error) {
                console.log(error.message);
                readlineSync.question(`Dados informados inválidos, nenhum tipo de veículo foi cadastrado. ${voltar}`);
            }
            break;
        case 3:
            console.log();
            console.log("Utilize um dos tipos abaixo para cadastrar o novo veículo");
            locadora.listarTiposVeiculo();
            console.log();
            let idTipoVeiculo = parseInt(readlineSync.question("Informe o id do tipo do veículo a ser cadastrado: "));
            let placa = readlineSync.question("Informe a placa do veículo: ").toUpperCase();
            let placaExiste = locadora.getVeiculoByPlaca(placa);
            if(placaExiste){
                console.log("Já existe um veículo com essa placa cadastrado no sistema. Por favor verifique");
                readlineSync.question(voltar);
                break;
            }
            let modelo = readlineSync.question("Informe o modelo do veículo a ser cadastrado: ").toUpperCase();
            let valorDiaria = parseFloat(readlineSync.question("Informe o valor da diária: "));
            try {
                locadora.cadastrarVeiculo(placa, modelo, idTipoVeiculo, valorDiaria);
                console.log(`Veículo ${modelo} com placa ${placa} cadastrado com sucesso!`);
                readlineSync.question(voltar);
            } catch (error) {
                console.log(error.message);
                readlineSync.question(voltar);
            }
            break;
        case 4:
            console.log();
            let cpf = readlineSync.question("Informe o CPF do cliente (somente números, 11 caracteres): ");
            if(!validaCPF(cpf)){
                console.log("CPF inválido. Precisa ter 11 caracteres numéricos");
                readlineSync.question(voltar);
                break;
            }
            const cpfExiste = locadora.getClienteByCPF(formataCPF(cpf));
            if(cpfExiste){
                console.log(`ERRO! Este CPF já está cadastrado no sistema para o cliente ${cpfExiste.nome}. Verifique`);
                readlineSync.question(voltar);
                break;
            }
            console.log();
            locadora.listarTiposCarteira()
            console.log();
            let tipoCarteiraCliente = parseInt(readlineSync.question("Informe o id do tipo da carteira do cliente: "));
            let nome = readlineSync.question("Informe o nome do cliente: ");
            try {
                locadora.cadastrarCliente(nome, cpf, tipoCarteiraCliente);
                console.log(`Cliente ${nome}, CPF ${formataCPF(cpf)}, cadastrado com sucesso`);
                readlineSync.question(voltar);
            } catch (error) {
                console.log(error.message);
                readlineSync.question(voltar);
            }
            break;
        case 5:
            let dataLocacao = readlineSync.question("Digite a data de início da locação (formato dd/mm/aaaa): ");
            if(!validaData(dataLocacao)){
                console.log("Data de locação inválida. Verifique");
                readlineSync.question(voltar);
            }
            let dataPrevisaoDevolucao = readlineSync.question("Digite a data prevista para devolução (formato dd/mm/aaaa): ");
            if(!validaData(dataPrevisaoDevolucao)){
                console.log("Data prevista para devolução inválida. Verifique");
                readlineSync.question(voltar);
            }
            dataLocacao = strPData(dataLocacao);
            dataPrevisaoDevolucao = strPData(dataPrevisaoDevolucao);
            let nDias = calculaNDias(dataLocacao, dataPrevisaoDevolucao);
            if(nDias <= 0){
                console.log("A data prevista para devolução não pode ser anterior ou igual a data de início da locação. Verifique");
                readlineSync.question(voltar);
            } else {
                let confirma = readlineSync.question(`Deseja realmente alugar um veículo por ${nDias} dias? (S/N)`).toUpperCase();
                while (confirma !== "S" && confirma !== "N"){
                    console.log("Sua resposta foi inválida. Por favor tente novamente");
                    confirma = readlineSync.question(`Deseja realmente alugar um veículo por ${nDias} dias? (S/N)`).toUpperCase();
                }
                if(confirma === "N"){
                    readlineSync.question(voltar);
                } else {
                    console.log();
                    locadora.listarClientes();
                    console.log();
                    let idClienteLocacao = parseInt(readlineSync.question("Informe o id do cliente que deseja alugar um veículo: "));
                    let clienteLocacao = locadora.getClienteById(idClienteLocacao);
                    while(!clienteLocacao){
                        console.log("Id do cliente não encontrado!");
                        console.log();
                        locadora.listarClientes();
                        console.log();
                        idClienteLocacao = parseInt(readlineSync.question("Informe o id do cliente que deseja alugar um veículo (ou digite 0 para retornar ao menu): "));
                        if(idClienteLocacao === 0){
                            break;
                        }
                        clienteLocacao = locadora.getClienteById(idClienteLocacao);
                    }
                    if(!clienteLocacao){
                        readlineSync.question(voltar);
                        break;
                    } else if(clienteLocacao.veiculoAlugado !== null){
                        let veiculoAlugado = locadora.getVeiculoById(clienteLocacao.veiculoAlugado)
                        console.log("Este cliente não pode alugar nenhum veículo no momento, pois ele já tem um veículo alugado");
                        console.log(`É necessário fazer a devolução do veículo ${veiculoAlugado.modelo} com a placa ${veiculoAlugado.placa} antes de alugar outro`);
                        readlineSync.question(voltar);
                        break;
                    } else {
                        console.log();
                        locadora.listaVeiculosPorTipoCarteira(clienteLocacao.tipoCarteira);
                        console.log();
                        let idVeiculoLocacao = parseInt(readlineSync.question("Informe o id do veículo a ser alugado (ou 0 para retornar ao menu): "));
                        if(idVeiculoLocacao === 0){
                            readlineSync.question(voltar);
                            break;
                        } else {
                            try {
                                locadora.registrarLocacao(idClienteLocacao, idVeiculoLocacao, dataLocacao, dataPrevisaoDevolucao);
                                console.log(`Veículo ${locadora.getVeiculoById(idVeiculoLocacao).modelo} alugado com sucesso para o cliente ${clienteLocacao.nome}`);
                                readlineSync.question(voltar);
                            } catch (error) {
                                console.log(error.message);
                                readlineSync.question(voltar);
                            }
                            break;
                        }
                    }
                    
                    
                }
            }
            break;
        case 6:
            console.log();
            let nomeCliente = readlineSync.question(`Informe o primeiro nome do cliente: `);
            let listaClientes = locadora.listarClientesPorTermo(nomeCliente);
            console.log(listaClientes);
            if(listaClientes === `Nenhum cliente encontrado com o termo ${nomeCliente}`){
                readlineSync.question(voltar);
                break;
            } else {
                let CPFClienteDevolucao = readlineSync.question(`Informe o CPF do cliente (apenas números): `);
                let clienteCPF = locadora.getClienteByCPF(formataCPF(CPFClienteDevolucao));
                while(!clienteCPF){
                    console.log("CPF incorreto, tente novamente!");
                    CPFClienteDevolucao = readlineSync.question(`Informe o CPF do cliente (apenas números, ou SAIR para voltar ao menu): `);
                    if(CPFClienteDevolucao.toUpperCase() === "SAIR"){
                        break;
                    }
                    clienteCPF = locadora.getClienteByCPF(formataCPF(CPFClienteDevolucao));
                }
                if(!clienteCPF){
                    readlineSync.question(voltar);
                    break;
                } else {
                    let locacoesCliente = locadora.listarLocacoesPorCliente(clienteCPF.id);
                    if(!locacoesCliente){
                        console.log(`Nenhuma locação encontrada para o cliente ${clienteCPF.nome} com CPF ${clienteCPF.cpf}`);
                    } else {
                        console.log(locacoesCliente);
                        let idLocacao = parseInt(readlineSync.question(`Informe o id da locação a ser devolvida: `));
                        let locacao = locadora.getLocacaoById(idLocacao);
                        if(locacao.idCliente !== clienteCPF.id){
                            console.log(`A locação que está tentando devolver não pertence a este CPF. Por favor confira os dados informados e reinicie o processo de devolução do veículo`);
                            readlineSync.question(voltar);
                            break;
                        }
                        if(locacao.finalizado){
                            console.log(`ERRO! A locação que está tentando devolver já está finalizada, e o veículo já foi devolvido em ${formataData(locacao.dataDevolucao)}. Por favor confira os dados informados e reinicie o processo de devolução do veículo`);
                            readlineSync.question(voltar);
                            break;
                        }
                        let dataDevolucao = readlineSync.question(`Informe a data da devolução do veículo (dd/mm/aaaa): `);
                        while(!validaData(dataDevolucao)){
                            console.log("Data informada inválida! ");
                            dataDevolucao = readlineSync.question(`Informe a data da devolução do veículo (dd/mm/aaaa, ou SAIR para voltar ao menu): `);
                            if(dataDevolucao.toUpperCase() === "SAIR"){
                                break;
                            }
                        }
                        if(dataDevolucao.toUpperCase() === "SAIR"){
                            readlineSync.question(voltar);
                            break;
                        } else {
                            dataDevolucao = strPData(dataDevolucao);
                            if(dataDevolucao > hoje){
                                console.log("ERRO! Data de devolução não pode ser maior que a data atual.");
                                readlineSync.question(voltar);
                                break;
                            }
                            let nDias = calculaNDias(locacao.dataLocacao, dataDevolucao)
                            if(nDias < 0){
                                console.log("ERRO! Data de devolução não pode ser maior que a data da locação.");
                                readlineSync.question(voltar);
                                break;
                            } else {
                                let veiculo = locadora.getVeiculoById(locacao.idVeiculo);
                                let cliente = locadora.getClienteById(locacao.idCliente);
                                console.log(`Finalizando a entrega da locação do veículo ${veiculo.modelo} com a placa ${veiculo.placa}, alugado para o cliente ${cliente.nome} e CPF ${cliente.cpf}`);
                                console.log(`Total da locação por ${nDias} dias, iniciado no dia ${formataData(locacao.dataLocacao)} e finalizado no dia ${formataData(dataDevolucao)}: `);
                                let confirma = readlineSync.question("Confirmar devolução do veículo ? (S/N)");
                                while (confirma.toUpperCase() !== "S" && confirma.toUpperCase() !== "N") {
                                    console.log("Resposta inválida!");
                                    confirma = readlineSync.question("Confirmar devolução do veículo ? (S/N)");
                                }
                                if(confirma.toUpperCase() === "N"){
                                    console.log("Operação de devolução do veículo não concluída".red);
                                    readlineSync(voltar);
                                    break;
                                } else {
                                    try {
                                        locadora.registrarDevolucao(locacao.id, dataDevolucao, nDias);
                                        console.log(`Veículo  ${veiculo.modelo} de placa ${veiculo.placa} devolvido com sucesso pelo cliente ${cliente.nome} com CPF ${cliente.cpf}`);
                                        console.log(`Já é possível emitir a fatura desta locação. Retorne ao menu para efetuar essa operação`);
                                        readlineSync.question(voltar)
                                    } catch (error) {
                                        console.log(error.message);
                                        readlineSync.question(voltar)
                                        break;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            console.log();
            break;
            case 7:
                let nomeClienteFatura = readlineSync.question(`Informe o primeiro nome do cliente: `);
                let listaClientesFatura = locadora.listarClientesPorTermo(nomeClienteFatura);
                console.log(listaClientesFatura);
                if(listaClientesFatura === `Nenhum cliente encontrado com o termo ${nomeClienteFatura}`){
                    readlineSync.question(voltar);
                    break;
                } else {
                    let CPFClienteFatura = readlineSync.question(`Informe o CPF do cliente (apenas números): `);
                    let clienteCPF = locadora.getClienteByCPF(formataCPF(CPFClienteFatura));
                    while(!clienteCPF){
                        console.log("CPF incorreto, tente novamente!");
                        CPFClienteFatura = readlineSync.question(`Informe o CPF do cliente (apenas números, ou SAIR para voltar ao menu): `);
                        if(CPFClienteFatura.toUpperCase() === "SAIR"){
                            break;
                        }
                        clienteCPF = locadora.getClienteByCPF(formataCPF(CPFClienteFatura));
                    }
                    if(!clienteCPF){
                        readlineSync.question(voltar);
                        break;
                    } else {
                        let locacoesCliente = locadora.listaLocacoesFinalizadasCliente(clienteCPF.id)
                        console.log(locacoesCliente);
                        if(locacoesCliente === `Não existem faturas a emitir para este cliente`){
                            readlineSync.question(voltar);
                            break;
                        } else {
                            let idFatura = parseInt(readlineSync.question("Informe o id da fatura: "));
                            let fatura = locadora.getLocacaoById(idFatura);
                            if(fatura.idCliente !== clienteCPF.id){
                                console.log(`ERRO! A fatura informada ${fatura.id} não pertence ao CPF ${clienteCPF.cpf}`);
                                readlineSync.question(voltar);
                                break;
                            }
                            if(!fatura.finalizado){
                                console.log(`ERRO! A fatura informada ${fatura.id} não foi finalizada. Realize a devolução do veículo primeiro`);
                                readlineSync.question(voltar);
                                break;
                            } else {
                                gerarFatura(fatura, clienteCPF, locadora.getVeiculoById(fatura.idVeiculo));
                                console.log();
                                readlineSync.question(voltar);
                                break;
                            }
                        }
                    }
                }
            case 8:
                console.log();
                let locacoesFinalizadas = locadora.listaLocacoesFinalizadas();
                console.log(locacoesFinalizadas);
                if(locacoesFinalizadas === `Não existem faturas finalizadas`){
                    readlineSync.question(voltar);
                    break
                } else {
                    let idFatura = parseInt(readlineSync.question("Informe o id da fatura que deseja emitir: "));
                    let fatura = locadora.getLocacaoById(idFatura);
                    if(!fatura.finalizado){
                        console.log(`ERRO! A fatura informada não está finalizada. Verifique e tente novamente`);
                        readlineSync.question(voltar);
                        break
                    } else {
                        let veiculo = locadora.getVeiculoById(fatura.idVeiculo);
                        let cliente = locadora.getClienteById(fatura.idCliente);
                        gerarFatura(fatura, cliente, veiculo);
                        readlineSync.question(voltar);
                        break
                    }
                }
        default:
            break;
    }
} while (op !== 0);
salvaTiposCarteira(locadora);
salvaTiposVeiculo(locadora);
salvaVeiculos(locadora);
salvaClientes(locadora);
salvaLocacoes(locadora)