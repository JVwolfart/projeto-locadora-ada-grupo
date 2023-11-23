import { Cliente } from "../Cliente";
import { Locadora } from "../Locadora";
import { formataData } from "../utils";
var Table = require('cli-table');

function listaVeiculosDisponiveis(locadora: Locadora){
    const veiculosDisponiveis = locadora.veiculos.filter(veiculo => veiculo.disponivel && !veiculo.baixado)
    if(veiculosDisponiveis.length === 0){
        return false;
    } else {
        const tabela = new Table({
            head: ["ID", "PLACA", "MODELO", "HABILITAÇÃO", "VALOR DIÁRIA"],
            colWidths: [5, 10, 15, 15, 15]
        })
        for (const veiculo of veiculosDisponiveis) {
            let valorDiaria = `R$ ${veiculo.valorDiaria.toFixed(2)}`
            tabela.push([veiculo.id, veiculo.placa, veiculo.modelo, veiculo.tipoVeiculo.tipoCarteira.tipo, valorDiaria])  
        }
        let qtdTipos = [];
        for (const tipoVeiculo of locadora.tiposVeiculo) {
            let qtdTipo = veiculosDisponiveis.filter(veiculo => veiculo.tipoVeiculo === tipoVeiculo).length;
            let tipo = tipoVeiculo.tipo;
            qtdTipos.push([tipo, qtdTipo])
        }
        return {tabela: tabela.toString(),
            totVeiculos: veiculosDisponiveis.length,
            qtdTipos: qtdTipos
        };
    }
}

function listaVeiculosIndisponiveis(locadora: Locadora){
    const veiculosIndisponiveis = locadora.veiculos.filter(veiculo => !veiculo.disponivel && !veiculo.baixado);
    if(veiculosIndisponiveis.length === 0){
        return false;
    } else {
        const tabela = new Table({
            head: ["ID", "PLACA", "MODELO", "HABILITAÇÃO", "VALOR DIÁRIA", "ALUGADO PARA", "DATA LOCAÇÃO", "PREVISÃO DEVOLUÇÃO"],
            colWidths: [5, 10, 15, 15, 15, 30, 15, 25]
        })
        for (const veiculo of veiculosIndisponiveis) {
            let valorDiaria = `R$ ${veiculo.valorDiaria.toFixed(2)}`;
            let alugadoPara = locadora.getClienteById(veiculo.alugadoPara).nome;
            let dataLocacao = formataData(veiculo.dataUltimaLocacao);
            let previsaoDevolucao = formataData(veiculo.dataPrevistaDevolucao);
            tabela.push([veiculo.id, veiculo.placa, veiculo.modelo, veiculo.tipoVeiculo.tipoCarteira.tipo, valorDiaria, alugadoPara, dataLocacao, previsaoDevolucao])  
        }
        let qtdTipos = [];
        for (const tipoVeiculo of locadora.tiposVeiculo) {
            let qtdTipo = veiculosIndisponiveis.filter(veiculo => veiculo.tipoVeiculo === tipoVeiculo).length;
            let tipo = tipoVeiculo.tipo;
            qtdTipos.push([tipo, qtdTipo])
        }
        return {tabela: tabela.toString(),
            totVeiculos: veiculosIndisponiveis.length,
            qtdTipos: qtdTipos
        };
    }
}

function listaVeiculosBaixados(locadora: Locadora){
    const veiculosBaixados = locadora.veiculos.filter(veiculo => veiculo.baixado);
    if(veiculosBaixados.length === 0){
        return false;
    } else {
        const tabela = new Table({
            head: ["ID", "PLACA", "MODELO", "HABILITAÇÃO"],
            colWidths: [5, 10, 15, 15]
        })
        for (const veiculo of veiculosBaixados) {
            tabela.push([veiculo.id, veiculo.placa, veiculo.modelo, veiculo.tipoVeiculo.tipoCarteira.tipo]);
        }
        let qtdTipos = [];
        for (const tipoVeiculo of locadora.tiposVeiculo) {
            let qtdTipo = veiculosBaixados.filter(veiculo => veiculo.tipoVeiculo === tipoVeiculo).length;
            let tipo = tipoVeiculo.tipo;
            qtdTipos.push([tipo, qtdTipo])
        }
        return {tabela: tabela.toString(),
            totVeiculos: veiculosBaixados.length,
            qtdTipos: qtdTipos
        };
    }
}

function listaClientesInativos(locadora: Locadora) {
    const clientesInativos = locadora.clientes.filter(cliente => !cliente.ativo);
    if (clientesInativos.length === 0) {
        return false;
    } else {
        const tabela = new Table({
            head: ["ID", "NOME", "CPF", "HABILITAÇÃO", "SITUAÇÃO"],
            colWidths: [5, 30, 20, 15, 15]
        })
        for (const cliente of clientesInativos) {
            tabela.push([cliente.id, cliente.nome, cliente.cpf, cliente.tipoCarteira.tipo, "INATIVO".red]);
        }
        return {
            tabela: tabela.toString(),
            qtdClientes: clientesInativos.length
        }
    }
}

function getVeiculoHistorico(locadora: Locadora, id: number){
    let veiculo = locadora.veiculos.find(veiculo => veiculo.id === id);
    if (!veiculo){
        return null;
    } else {
        return veiculo;
    }
}

function historicoClientes(locadora: Locadora, cliente: Cliente) {
    let faturasCliente = locadora.locacoes.filter(locacao => locacao.idCliente === cliente.id && locacao.finalizado);
    if (faturasCliente.length === 0) {
        return false;
    } else {
        const tabela = new Table({
            head: ["ID", "VEÍCULO", "PLACA", "DATA LOCAÇÃO", "DATA DEVOLUÇÃO", "Nº DIAS", "TOTAL DIÁRIAS", "TOTAL ACRÉSCIMO", "VALOR TOTAL"],
            colsWidth: [5, 15, 15, 20, 20, 10, 15, 15, 15]
        })
        let totalLocacoes = faturasCliente.length;
        let totalNDias = 0;
        let totDiarias = 0;
        let totAcrescimo = 0;
        let totGeral = 0;
        for (const fatura of faturasCliente) {
            let veiculo = getVeiculoHistorico(locadora,fatura.idVeiculo);
            let dataLocacao = formataData(fatura.dataLocacao);
            let dataDevolucao = formataData(fatura.dataDevolucao);
            let totalDiarias = fatura.nDias*fatura.valorDiaria;
            let totalAcrescimo = totalDiarias*(fatura.acrescimo/100);
            let totalGeral = totalDiarias+totalAcrescimo;
            totalNDias += fatura.nDias;
            totDiarias += totalDiarias;
            totAcrescimo += totalAcrescimo;
            totGeral += totalGeral;
            tabela.push([fatura.id, veiculo.modelo, veiculo.placa, dataLocacao, dataDevolucao, fatura.nDias, `R$ ${totalDiarias.toFixed(2)}`, `R$ ${totalAcrescimo.toFixed(2)}`, `R$ ${totalGeral.toFixed(2)}`])
        }
        return {
            tabela: tabela.toString(),
            totalLocacoes: totalLocacoes,
            totalNDias: totalNDias,
            totDiarias: `R$ ${totDiarias.toFixed(2)}`,
            totAcrescimo: `R$ ${totAcrescimo.toFixed(2)}`,
            totGeral: `R$ ${totGeral.toFixed(2)}`,
        }
    }
}

export {listaVeiculosDisponiveis, listaVeiculosIndisponiveis, listaVeiculosBaixados, listaClientesInativos, historicoClientes, getVeiculoHistorico};