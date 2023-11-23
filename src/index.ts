import * as readlineSync from 'readline-sync';
import 'colors';
import { Locadora } from './Locadora';
import { formataCPF, validaData, validaCPF, strPData, calculaNDias, formataData, } from './utils';
import { validaClienteParaDesativar, validaClienteParaReativar, validaVeiculoParaBaixa, validaVeiculoParaReativar } from './auxiliar';
import { getVeiculoHistorico, historicoClientes, listaClientesInativos, listaVeiculosBaixados, listaVeiculosDisponiveis, listaVeiculosIndisponiveis } from './relatórios';
import { menu, inicializando, finalizando, agradecimentos, inicializandoDev, finalizadoDev } from './Menu';
import { gerarFatura } from './Fatura';

const locadora = new Locadora();

inicializando(locadora);
//inicializandoDev(locadora);

let op: number;
let voltar = "Pressione ENTER para voltar ao menu";
const hoje = new Date();

do {
    menu();
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
                break;
            }
            let dataPrevisaoDevolucao = readlineSync.question("Digite a data prevista para devolução (formato dd/mm/aaaa): ");
            if(!validaData(dataPrevisaoDevolucao)){
                console.log("Data prevista para devolução inválida. Verifique");
                readlineSync.question(voltar);
                break;
            }
            dataLocacao = strPData(dataLocacao);
            dataPrevisaoDevolucao = strPData(dataPrevisaoDevolucao);
            let nDias = calculaNDias(dataLocacao, dataPrevisaoDevolucao);
            if(nDias <= 0){
                console.log("A data prevista para devolução não pode ser anterior ou igual a data de início da locação. Verifique");
                readlineSync.question(voltar);
                break;
            } else {
                let confirma = readlineSync.question(`Deseja realmente alugar um veículo por ${nDias} dias? (S/N)`).toUpperCase();
                while (confirma !== "S" && confirma !== "N"){
                    console.log("Sua resposta foi inválida. Por favor tente novamente");
                    confirma = readlineSync.question(`Deseja realmente alugar um veículo por ${nDias} dias? (S/N)`).toUpperCase();
                }
                if(confirma === "N"){
                    readlineSync.question(voltar);
                    break;
                } else {
                    console.log();
                    locadora.listarClientes();
                    console.log();
                    let idClienteLocacao = parseInt(readlineSync.question("Informe o id do cliente que deseja alugar um veículo: "));
                    let clienteLocacao = locadora.getClienteById(idClienteLocacao);
                    while(!clienteLocacao){
                        locadora.listarClientes();
                        console.log();
                        console.log("Id do cliente não encontrado!");
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
                        let veiculoAlugado = locadora.getVeiculoById(clienteLocacao.veiculoAlugado);
                        
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
                        readlineSync.question(voltar);
                        break;
                    } else {
                        console.log(locacoesCliente);
                        let idLocacao = parseInt(readlineSync.question(`Informe o id da locação a ser devolvida: `));
                        let locacao = locadora.getLocacaoById(idLocacao);
                        if(!locacao){
                            console.log("Id da locação não encontrado, ou inválido");
                            readlineSync.question(voltar);
                            break;
                        }
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
                                    readlineSync.question(voltar);
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
                                gerarFatura(fatura, clienteCPF, getVeiculoHistorico(locadora, fatura.idVeiculo));
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
                        let veiculo = getVeiculoHistorico(locadora, fatura.idVeiculo);
                        let cliente = locadora.getClienteByIdTodos(fatura.idCliente);
                        gerarFatura(fatura, cliente, veiculo);
                        readlineSync.question(voltar);
                        break
                    }
                }
            case 9:
                console.log();
                locadora.listaTodosVeiculos();
                console.log();
                let idVeiculo = parseInt(readlineSync.question("Informe o id do veículo que deseja dar baixa: "));
                let veiculo = locadora.getVeiculoById(idVeiculo);
                if(!veiculo){
                    console.log("Id do veículo não encontrado, ou inválido");
                    readlineSync.question(voltar);
                    break;
                }
                let veiculoValido = validaVeiculoParaBaixa(veiculo);
                if(!veiculoValido){
                    console.log("O id informado não é válido, ou o veículo já se encontra baixado, ou está alugado. Verifique a situação e tente novamente");
                    readlineSync.question(voltar);
                    break;
                } else {
                    locadora.baixarVeiculo(veiculo);
                    console.log(`Veículo ${veiculo.modelo} com placa ${veiculo.placa} baixado com sucesso! Não é mais possível alugar este veículo`.red);
                    readlineSync.question(voltar);
                    break;
                }
            case 10:
                console.log();
                locadora.listarClientes();
                console.log();
                let idCliente = parseInt(readlineSync.question("Informe o id do cliente que deseja desativar: "));
                let cliente = locadora.getClienteById(idCliente);
                if(!cliente){
                    console.log("Id do cliente não encontrado, ou inválido");
                    readlineSync.question(voltar);
                    break;
                }
                let clienteValido = validaClienteParaDesativar(cliente);
                if(!clienteValido){
                    console.log("O id informado não é válido, ou o cliente já se encontra desativado, ou possui pendências que impedem que seja desativado (veículo alugado e não devolvido). Verifique a situação e tente novamente");
                    readlineSync.question(voltar);
                    break;
                } else {
                    locadora.removerCliente(cliente);
                    console.log(`Cliente ${cliente.nome} com CPF ${cliente.cpf} desativado com sucesso! Não é mais possível alugar veículos para este cliente`.red);
                    readlineSync.question(voltar);
                    break;
                }
            case 11:
                console.log();
                console.log(locadora.listaVeiculosBaixados());
                console.log();
                let idVeiculoReativar = parseInt(readlineSync.question("Informe o id do veículo a ser reativado: "));
                let veiculoReativar = locadora.getVeiculoBaixadoById(idVeiculoReativar);
                let veiculoValidoReativar = validaVeiculoParaReativar(veiculoReativar);
                if(!veiculoValidoReativar){
                    console.log("ERRO! Id do veículo não encontrado, ou inválido, ou veículo não está baixado. Verifique");
                } else {
                    locadora.reativarVeiculo(veiculoReativar);
                    console.log(`Veículo ${veiculoReativar.modelo} com placa ${veiculoReativar.placa} reativado com sucesso! Já é possível realizar locações deste veículo`.green);
                }
                readlineSync.question(voltar);
                break;
            case 12:
                console.log();
                console.log(locadora.listaClientesInativos());
                console.log();
                let idClienteReativar = parseInt(readlineSync.question("Informe o id do cliente que deseja reativar: "))
                let clienteReativar = locadora.getClienteInativoById(idClienteReativar);
                let clienteValidoReativar = validaClienteParaReativar(clienteReativar);
                if(!clienteValidoReativar){
                    console.log("ERRO! Id do cliente não encontrado, ou inválido, ou cliente já está ativo. Verifique");
                } else {
                    locadora.reativarCliente(clienteReativar);
                    console.log(`Cliente ${clienteReativar.nome} com CPF ${clienteReativar.cpf} reativado com sucesso! Já é possível alugar veículos para este cliente`.green);
                }
                readlineSync.question(voltar);
                break;
            case 13:
                console.log();
                locadora.listaVeiculos();
                readlineSync.question(voltar);
                break;
            case 14:
                console.log();
                console.log("Relatório dos veículos disponíveis para locação");
                console.log();
                if(listaVeiculosDisponiveis(locadora)){
                    let relatorio = listaVeiculosDisponiveis(locadora);
                    console.log(relatorio["tabela"]);
                    console.log(`Total geral de veículos disponíveis para locação: ${relatorio["totVeiculos"]}`);
                    for (const tipo of relatorio["qtdTipos"]) {
                        console.log(`Total de veículos disponíveis do tipo ${tipo[0]}: ${tipo[1]}`);
                    }
                } else {
                    console.log("Não existem veículos disponíveis para locação neste momento");
                    
                }
                readlineSync.question(voltar);
                break;
            case 15:
                console.log();
                console.log("Relatório dos veículos indisponíveis (que estão alugados)");
                console.log();
                if(listaVeiculosIndisponiveis(locadora)){
                    let relatorio = listaVeiculosIndisponiveis(locadora);
                    console.log(relatorio["tabela"]);
                    console.log(`Total geral de veículos indisponíveis para locação: ${relatorio["totVeiculos"]}`);
                    for (const tipo of relatorio["qtdTipos"]) {
                        console.log(`Total de veículos indisponíveis do tipo ${tipo[0]}: ${tipo[1]}`);
                    }
                } else {
                    console.log("Não existem veículos indisponíveis para locação neste momento");
                    
                }
                readlineSync.question(voltar);
                break;
            case 16: // PRI
                console.log();
                console.log("Relatório dos veículos baixados");
                console.log();
                if(listaVeiculosIndisponiveis(locadora)){
                    let relatorio = listaVeiculosBaixados(locadora);
                    console.log(relatorio["tabela"]);
                    console.log(`Total geral de veículos baixados: ${relatorio["totVeiculos"]}`);
                    for (const tipo of relatorio["qtdTipos"]) {
                        console.log(`Total de veículos baixados do tipo ${tipo[0]}: ${tipo[1]}`);
                    }
                } else {
                    console.log("Não existem veículos indisponíveis para locação neste momento");
                    
                }
                readlineSync.question(voltar);
                break;
            case 17: // PIETRA
                console.log();
                console.log("Relatório dos clientes inativos/cancelados");
                console.log();
                let relatorio = listaClientesInativos(locadora);
                if(relatorio){
                    console.log(relatorio.tabela);
                    console.log(`Quantidade de clientes inativos: ${relatorio.qtdClientes}`);
                } else {
                    console.log("Não existe nenhum cliente inativo no momento");
                }
                readlineSync.question(voltar);
                break;
            case 18:
                console.log();
                locadora.listarClientes();
                console.log();
                let idClienteHistorico = parseInt(readlineSync.question("Informe o id do cliente que você deseja ver o histórico: "));
                let clienteHistorico = locadora.getClienteById(idClienteHistorico);
                if (!clienteHistorico) {
                    console.log("Id do cliente não encontrado, ou inválido, ou o cliente está inativo");
                    readlineSync.question(voltar);
                    break;
                } else if(clienteHistorico.historico.length === 0) {
                    console.log(`O cliente ${clienteHistorico.nome} com CPF ${clienteHistorico.cpf} não possui nenhum histórico de locação`);
                    readlineSync.question(voltar);
                    break;
                } else {
                    console.log();
                    let historico = historicoClientes(locadora, clienteHistorico);
                    if(!historico){
                        console.log(`O cliente ${clienteHistorico.nome} com CPF ${clienteHistorico.cpf} ainda não possui nenhum histórico de locação`);
                        readlineSync.question(voltar);
                        break;    
                    } else {
                        console.log(`Histórico de locação do cliente ${clienteHistorico.nome} com CPF ${clienteHistorico.cpf} e habilitação categoria ${clienteHistorico.tipoCarteira.tipo}`);
                        console.log(historico.tabela);
                        console.log(`Total de locações feitas pelo cliente: ${historico.totalLocacoes}`);
                        console.log(`Quantidade geral de dias alugados: ${historico.totalNDias}`);
                        console.log(`Total geral das diárias: ${historico.totDiarias}`);
                        console.log(`Total geral de acréscimos/impostos: ${historico.totAcrescimo}`);
                        console.log(`Total faturado: ${historico.totGeral}`);
                    }
                    readlineSync.question(voltar);
                    break;
                }
            case 19: // PIETRA
                console.log();
                console.log(listaClientesInativos(locadora)["tabela"]);
                console.log();
                let idClienteInativoHistorico = parseInt(readlineSync.question("Informe o id do cliente que você deseja ver o histórico: "));
                let clienteInativoHistorico = locadora.getClienteInativoById(idClienteInativoHistorico);
                if (!clienteInativoHistorico) {
                    console.log("Id do cliente não encontrado, ou inválido, ou o cliente está ativo");
                    readlineSync.question(voltar);
                    break;
                } else if(clienteInativoHistorico.historico.length === 0) {
                    console.log(`O cliente ${clienteInativoHistorico.nome} com CPF ${clienteInativoHistorico.cpf} não possui nenhum histórico de locação`);
                    readlineSync.question(voltar);
                    break;
                } else {
                    console.log();
                    let historico = historicoClientes(locadora, clienteInativoHistorico);
                    if(!historico){
                        console.log(`O cliente ${clienteInativoHistorico.nome} com CPF ${clienteInativoHistorico.cpf} ainda não possui nenhum histórico de locação`);
                        readlineSync.question(voltar);
                        break;    
                    } else {
                        console.log(`Histórico de locação do cliente ${clienteInativoHistorico.nome} com CPF ${clienteInativoHistorico.cpf} e habilitação categoria ${clienteInativoHistorico.tipoCarteira.tipo}`);
                        console.log(historico.tabela);
                        console.log(`Total de locações feitas pelo cliente: ${historico.totalLocacoes}`);
                        console.log(`Quantidade geral de dias alugados: ${historico.totalNDias}`);
                        console.log(`Total geral das diárias: ${historico.totDiarias}`);
                        console.log(`Total geral de acréscimos/impostos: ${historico.totAcrescimo}`);
                        console.log(`Total faturado: ${historico.totGeral}`);
                    }
                    readlineSync.question(voltar);
                    break;
                }
        case 0:
            console.log("Até mais!".cyan);
            break;
        default:
            console.log("Opção informada inválida! (apenas números de 0 a 19)");
            readlineSync.question(voltar);
            break;
    }
} while (op !== 0);

finalizando(locadora);
//finalizadoDev(locadora);
readlineSync.question("Pressione ENTER para sair do sistema");
agradecimentos();
