import { Locadora } from "../Locadora";
import * as fs from "fs";
import { TipoVeiculo } from "../TipoVeiculo";
import { Veiculo } from "../Veiculo";
import { TipoCarteira } from "../TipoCarteira";
import { Cliente } from "../Cliente";
import { Locacao } from "../Locacao";


function salvaTiposCarteira(locadora: Locadora){
    fs.writeFileSync("dados/tipos_carteira.txt", JSON.stringify(locadora.tiposCarteira,null, 5));
}

function carregaTiposCarteira(locadora: Locadora){
    let dados =  fs.readFileSync("dados/tipos_carteira.txt", "utf-8");
    let listaTiposCarteira = JSON.parse(dados);
    for (let i = 0; i < listaTiposCarteira.length; i++) {
        let tipo = listaTiposCarteira[i].tipo;
        let descricao = listaTiposCarteira[i].descricao;
        let novoTipo = new TipoCarteira(tipo, descricao)
        locadora.tiposCarteira.push(novoTipo);
    }
}

function salvaTiposVeiculo(locadora: Locadora){
    fs.writeFileSync("dados/tipos_veiculo.txt", JSON.stringify(locadora.tiposVeiculo,null, 5));
}

function carregaTiposVeiculo(locadora: Locadora){
    let dados =  fs.readFileSync("dados/tipos_veiculo.txt", "utf-8");
    let listaTiposVeiculo = JSON.parse(dados);
    for (let i = 0; i < listaTiposVeiculo.length; i++) {
        let tipo = listaTiposVeiculo[i].tipo;
        let acrescimo = listaTiposVeiculo[i].acrescimo;
        let idTipoCarteira = listaTiposVeiculo[i].tipoCarteira.id;
        let tipoCarteira = locadora.getTipoCarteiraById(idTipoCarteira);
        let novoTipo = new TipoVeiculo(tipo, acrescimo, tipoCarteira);
        locadora.tiposVeiculo.push(novoTipo);
    }
}

function salvaVeiculos(locadora: Locadora){
    fs.writeFileSync("dados/veiculos.txt", JSON.stringify(locadora.veiculos,null, 5));
}

function carregaVeiculos(locadora: Locadora){
    let dados =  fs.readFileSync("dados/veiculos.txt", "utf-8");
    let listaVeiculos = JSON.parse(dados);
    for (let i = 0; i < listaVeiculos.length; i++) {
        let idTipoVeiculo = listaVeiculos[i].tipoVeiculo.id;
        let tipoVeiculo = locadora.getTipoVeiculoById(idTipoVeiculo);
        let placa = listaVeiculos[i].placa;
        let modelo = listaVeiculos[i].modelo;
        let valorDiaria = listaVeiculos[i].valorDiaria;
        let veiculo = new Veiculo(modelo, placa, valorDiaria, tipoVeiculo);
        veiculo.alugadoPara = listaVeiculos[i].alugadoPara;
        veiculo.disponivel = listaVeiculos[i].disponivel;
        veiculo.baixado = listaVeiculos[i].baixado;
        if (listaVeiculos[i].dataUltimaLocacao) {
            veiculo.dataUltimaLocacao = new Date(listaVeiculos[i].dataUltimaLocacao);   
        }
        if(listaVeiculos[i].dataPrevistaDevolucao){
            veiculo.dataPrevistaDevolucao = new Date(listaVeiculos[i].dataPrevistaDevolucao);
        }
        locadora.veiculos.push(veiculo);
    }
}

function salvaClientes(locadora: Locadora){
    fs.writeFileSync("dados/clientes.txt", JSON.stringify(locadora.clientes,null, 5));
}

function carregaClientes(locadora: Locadora){
    let dados =  fs.readFileSync("dados/clientes.txt", "utf-8");
    let listaClientes = JSON.parse(dados);
    for (let i = 0; i < listaClientes.length; i++) {
        let nome = listaClientes[i].nome;
        let cpf = listaClientes[i].cpf;
        let idTipoCarteira = listaClientes[i].tipoCarteira.id;
        let tipoCarteira = locadora.getTipoCarteiraById(idTipoCarteira);
        let cliente = new Cliente(nome, cpf, tipoCarteira);
        cliente.veiculoAlugado = listaClientes[i].veiculoAlugado;
        cliente.historico = listaClientes[i].historico;
        cliente.ativo = listaClientes[i].ativo;
        locadora.clientes.push(cliente);
    }
}

function salvaLocacoes(locadora: Locadora){
    fs.writeFileSync("dados/locacoes.txt", JSON.stringify(locadora.locacoes,null, 5));
}

function carregaLocacoes(locadora: Locadora){
    let dados =  fs.readFileSync("dados/locacoes.txt", "utf-8");
    let listaLocacoes = JSON.parse(dados);
    for (let i = 0; i < listaLocacoes.length; i++) {
        let idCliente = listaLocacoes[i].idCliente;
        let idVeiculo = listaLocacoes[i].idVeiculo;
        let dataLocacao = new Date(listaLocacoes[i].dataLocacao);
        let dataPrevistaDevolucao = new Date(listaLocacoes[i].dataPrevistaDevolucao);
        let dataDevolucao = null
        if (listaLocacoes[i].dataDevolucao !== null){
            dataDevolucao = new Date(listaLocacoes[i].dataDevolucao);
        }
        let nDias = listaLocacoes[i].nDias;
        let valorDiaria = listaLocacoes[i].valorDiaria;
        let acrescimo = listaLocacoes[i].acrescimo;
        let finalizado = listaLocacoes[i].finalizado;
        let locacao = new Locacao(idCliente, idVeiculo, dataLocacao, dataPrevistaDevolucao);
        locacao.dataDevolucao = dataDevolucao;
        locacao.nDias = nDias;
        locacao.valorDiaria = valorDiaria;
        locacao.acrescimo = acrescimo;
        locacao.finalizado = finalizado;
        locadora.locacoes.push(locacao);
    }
}

export {salvaTiposCarteira, carregaTiposCarteira, salvaTiposVeiculo, carregaTiposVeiculo, salvaVeiculos, carregaVeiculos, salvaClientes, carregaClientes, salvaLocacoes, carregaLocacoes}