import * as sleep from "system-sleep"
import { Locadora } from "../Locadora";
var figlet = require("figlet");
import { carregaClientes, carregaVeiculos, carregaLocacoes, carregaTiposCarteira, carregaTiposVeiculo, salvaClientes, salvaLocacoes, salvaTiposCarteira, salvaTiposVeiculo, salvaVeiculos } from "../Crud";

function menu(){
    let rentACar = figlet.textSync(`   ${'RENT A CAR'}`, {
        font: "Standard",
        horizontalLayout: "full",
        verticalLayout: "default",
        width: 100,
        whitespaceBreak: true,
    
      })
    console.log(rentACar.red);
    
    const menu = `
        ${"*****************************************************************************".bgWhite.red}
        ${"*************          MENU DO SISTEMA RENT A CAR           *****************".bgWhite.red}
        ${"*****************************************************************************".bgWhite.red}
    
                            1 - Cadastrar tipo de carteira
                            2 - Cadastrar tipo de veículo
                            3 - Cadastrar veículo
                            4 - Cadastrar cliente
                            5 - Registrar locação
                            6 - Registrar devolução
                            7 - Emitir fatura cliente por CPF
                            8 - Emitir fatura por id
                            9 - Remover/dar baixa em veículo
                            10 - Remover/inativar cliente
                            11 - Reativar veículo
                            12 - Reativar cliente
                            13 - Listar todos os veículos (exceto baixados)
                            14 - Listar veículos disponíveis
                            15 - Listar veículos indisponíveis (em locação)
                            16 - Listar veículos baixados (removidos)
                            17 - Listar clientes inativos (removidos)
                            18 - Histórico de locações de clientes ativos
                            19 - Histórico de locações de clientes inativos
                            0 - Sair do sistema
    `

    console.log(menu);
    
}

function finalizando(locadora: Locadora){
    console.log("Salvando dados...");
    console.log("Salvando tipos de carteira...".yellow);
    salvaTiposCarteira(locadora);
    sleep(1000);
    console.log("Salvando tipos de veículo...".blue);
    salvaTiposVeiculo(locadora);
    sleep(1000);
    console.log("Salvando veículos...".cyan);
    salvaVeiculos(locadora);
    sleep(1000);
    console.log("Salvando clientes...".magenta);
    salvaClientes(locadora);
    sleep(1000);
    console.log("Salvando históricos de locação...".green);
    salvaLocacoes(locadora)
    sleep(1000);
    console.log("Dados salvos com sucesso!".green);
}

function inicializando(locadora: Locadora){
    try {
        console.log("Carregando tabelas...");
        console.log("Carregando tipos de carteira...".yellow);
        carregaTiposCarteira(locadora);
        sleep(1000);
        console.log("Carregando tipos de veículo...".blue);
        carregaTiposVeiculo(locadora);
        sleep(1000);
        console.log("Carregando veículos...".cyan);
        carregaVeiculos(locadora);
        sleep(1000);
        console.log("Carregando clientes...".magenta);
        carregaClientes(locadora);
        sleep(1000);
        console.log("Carregando históricos de locação...".green);
        carregaLocacoes(locadora);
        sleep(1000);
        console.log("Dados inicializados com sucesso!".green);
    } catch (error) {
        console.log("Erro ao carregar os dados".red);
    }
}

function agradecimentos(){
    console.log("Turma 1090 Vem Ser Tech Back End Ada iFood".green);
    sleep(1000);
    console.log("Desenvolvedores do sistema:".blue);
    sleep(1000);
    console.log("João Vitor Wolfart");
    sleep(1000);
    console.log("Priscilla Araújo");
    sleep(1000);
    console.log("Pietra Almeida");
    sleep(1000);
    console.log("Professores: ".blue);
    sleep(1000);
    console.log("Dannyel Kayke");
    sleep(1000);
    console.log("Rafael Costa");
    sleep(1000);
}

function inicializandoDev(locadora: Locadora) {
    try {
        carregaTiposCarteira(locadora);
        carregaTiposVeiculo(locadora);
        carregaVeiculos(locadora);
        carregaClientes(locadora);
        carregaLocacoes(locadora);
    } catch (error) {
        console.log("Erro ao carregar os dados".red);
    }
}

function finalizadoDev(locadora: Locadora){
    salvaTiposCarteira(locadora);
    salvaTiposVeiculo(locadora);
    salvaVeiculos(locadora);
    salvaClientes(locadora);
    salvaLocacoes(locadora)
}


export {menu, inicializando, finalizando, agradecimentos, inicializandoDev, finalizadoDev}