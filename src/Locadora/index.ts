import { Cliente } from "../Cliente"
import { Locacao } from "../Locacao";
import { TipoCarteira } from "../TipoCarteira";
import { TipoVeiculo } from "../TipoVeiculo";
import { Veiculo } from "../Veiculo";
import { formataCPF, formataData, validaCPF } from "../utils";
var Table = require('cli-table');


class Locadora {
    private _clientes: Cliente[];
    private _veiculos: Veiculo[];
    private _locacoes: Locacao[];
    private _tiposVeiculo: TipoVeiculo[];
    private _tiposCarteira: TipoCarteira[];

    constructor(){
        this._clientes = [];
        this._veiculos = [];
        this._locacoes = [];
        this._tiposVeiculo = [];
        this._tiposCarteira = [];
    }

    get clientes(){
        return this._clientes;
    }

    get veiculos(){
        return this._veiculos;
    }

    get locacoes(){
        return this._locacoes;
    }

    get tiposVeiculo(){
        return this._tiposVeiculo;
    }

    get tiposCarteira(){
        return this._tiposCarteira;
    }

    getTipoCarteiraById(id: number){
        return this._tiposCarteira.find(tipoCarteira => tipoCarteira.id === id);
    }

    getTipoCarteiraByTipo(tipo: string){
        return this._tiposCarteira.find(tipoCarteira => tipoCarteira.tipo.toUpperCase() === tipo.toUpperCase());
    }

    getTipoVeiculoById(id: number){
        return this._tiposVeiculo.find(tipoVeiculo => tipoVeiculo.id === id);
    }

    getTipoVeiculoByTipo(tipo: string){
        return this._tiposVeiculo.find(tipoVeiculo => tipoVeiculo.tipo.toUpperCase() === tipo.toUpperCase());
    }

    getClienteById(id: number){
        const cliente =  this._clientes.find(cliente => cliente.id === id);
        if(!cliente){
            return null;
        }
        if(cliente.ativo){
            return cliente;
        } else {
            return null;
        }
    }

    getClienteInativoById(id: number){
        const cliente =  this._clientes.find(cliente => cliente.id === id);
        if(!cliente){
            return null;
        }
        if(!cliente.ativo){
            return cliente;
        } else {
            return null;
        }
    }

    getClienteByCPF(cpf: string){
        return this._clientes.find(cliente => cliente.cpf === cpf);
    }

    getVeiculoById(id: number){
        const veiculo = this._veiculos.find(veiculo => veiculo.id === id);
        if(!veiculo){
            return null;
        }
        if(veiculo.baixado){
            return null;
        } else {
            return veiculo;
        }
    }

    getVeiculoBaixadoById(id: number){
        const veiculo = this._veiculos.find(veiculo => veiculo.id === id);
        if(!veiculo){
            return null;
        }
        if(!veiculo.baixado){
            return null;
        } else {
            return veiculo;
        }
    }

    getVeiculoByPlaca(placa: string){
        return this._veiculos.find(veiculo => veiculo.placa.toUpperCase() === placa.toUpperCase());
    }

    getLocacaoById(id: number){
        return this._locacoes.find(locacao => locacao.id === id);
    }

    cadastrarTipoCarteira(tipo: string, descricao: string){
        if(!tipo || !descricao){
            throw new Error("Dados inválidos! Tipo de carteira ou descrição incorretos ou não informados");
        }
        const tipoExiste = this.getTipoCarteiraByTipo(tipo);
        if(tipoExiste){
            throw new Error("Este tipo de carteira já está cadastrado no sistema. Por favor verifique");
        } else {
            const novoTipo = new TipoCarteira(tipo, descricao);
            this._tiposCarteira.push(novoTipo);
        }
        
    }

    listarTiposCarteira(){
        if (this.tiposCarteira.length === 0) {
            console.log("Não há nenhum tipo de carteira cadastrado nesse momento");
        } else {
            console.log("Segue abaixo os tipos de carteira já cadastrados no sistema:");
            const tabela = new Table({
                head: ["id", "tipo de carteira", "descrição do tipo"],
                colWidths: [5, 20, 50]
            });
            for (const tipoCarteira of this.tiposCarteira) {
                tabela.push([tipoCarteira.id, tipoCarteira.tipo, tipoCarteira.descricao]);
            }
            console.log(tabela.toString());
        }
    }

    cadastrarTipoVeiculo(tipo: string, acrescimo: number, idTipoCarteira: number){
        if(!tipo || !acrescimo || !idTipoCarteira){
            throw new Error("Dados inválidos! Tipo de veículo, acréscimo ou id do tipo de carteira incorretos ou não informados");
        } 
        const tipoCadastrado = this.getTipoVeiculoByTipo(tipo);
        if(tipoCadastrado){
            throw new Error("Dados inválidos! Tipo de veículo já está cadastrado no sistema");
        }
        const tipoCarteira = this.getTipoCarteiraById(idTipoCarteira);
        if (!tipoCarteira){
            throw new Error("Dados inválidos! Tipo de carteira não encontrado. Verifique e tente novamente");
        }
        else {
            const novoTipo = new TipoVeiculo(tipo, acrescimo, tipoCarteira);
            this._tiposVeiculo.push(novoTipo);
        }
    }

    listarTiposVeiculo(){
        if(this._tiposVeiculo.length === 0){
            console.log("Não há nenhum tipo de veículo cadastrado nesse momento ");
        } else {
            console.log("Segue abaixo todos os tipos de veículo cadastrados:");
            const tabela = new Table({
                head: ["ID", "TIPO", "ACRÉSCIMO"],
                colWidths: [5, 10, 15]
            })
            for (const tipoVeiculo of this._tiposVeiculo) {
                tabela.push([tipoVeiculo.id, tipoVeiculo.tipo, `${tipoVeiculo.acrescimo} %`])
            }
            console.log(tabela.toString());
        }
    }

    cadastrarVeiculo(placa: string, modelo: string, idTipoVeiculo: number, valorDiaria: number){        
        if(!placa || !modelo || !idTipoVeiculo || !valorDiaria){
            throw new Error("Dados inválidos. Placa, modelo, tipo de veículo e valor da diária precisam ser informados");
        }
        const veiculoCadastrado = this.getVeiculoByPlaca(placa);
        if(veiculoCadastrado){
            throw new Error("Dados inválidos. Já existe um veículo com essa placa cadastrado no sistema");
        }
        const tipoVeiculo = this.getTipoVeiculoById(idTipoVeiculo);
        if(!tipoVeiculo){
            throw new Error("Dados inválidos. Tipo de veículo não encontrado");
        } else {
            const novoVeiculo = new Veiculo(modelo, placa, valorDiaria, tipoVeiculo);
            this._veiculos.push(novoVeiculo);
        }
    }

    listaVeiculos(){
        let veiculos = this._veiculos.filter(veiculo => !veiculo.baixado);
        if(veiculos.length === 0){
            console.log("Nenhum veículo cadastrado no momento");
        } else {
            console.log("Segue abaixo todos os veículos cadastrados no sistema: ");
            const tabela = new Table({
                head: ["ID", "PLACA", "MODELO", "HABILITAÇÃO", "VALOR DIÁRIA", "DISPONÍVEL"],
                colWidths: [5, 10, 15, 15, 15, 15]
            })
            for (const veiculo of veiculos) {
                let valorDiaria = "R$" + veiculo.valorDiaria.toFixed(2);
                let disponivel = veiculo.disponivel ? "DISPONÍVEL".green : "INDISPONÍVEL".red;
                tabela.push([veiculo.id, veiculo.placa, veiculo.modelo, veiculo.tipoVeiculo.tipoCarteira.tipo, valorDiaria, disponivel])
            }
            console.log(tabela.toString());
            
        }
    }

    listaTodosVeiculos(){
        if(this._veiculos.length === 0){
            console.log("Nenhum veículo cadastrado no momento");
        } else {
            console.log("Segue abaixo todos os veículos cadastrados no sistema: ");
            const tabela = new Table({
                head: ["ID", "PLACA", "MODELO", "HABILITAÇÃO", "VALOR DIÁRIA", "DISPONÍVEL", "BAIXADO"],
                colWidths: [5, 10, 15, 15, 15, 15, 15]
            })
            for (const veiculo of this._veiculos) {
                let valorDiaria = "R$" + veiculo.valorDiaria.toFixed(2);
                let disponivel = veiculo.disponivel ? "DISPONÍVEL".green : "INDISPONÍVEL".red;
                let baixado = veiculo.baixado ? "SIM".red : "NÃO".green;
                tabela.push([veiculo.id, veiculo.placa, veiculo.modelo, veiculo.tipoVeiculo.tipoCarteira.tipo, valorDiaria, disponivel, baixado])
            }
            console.log(tabela.toString());
            
        }
    }

    listaVeiculosPorTipoCarteira(tipoCarteira: TipoCarteira){
        const veiculos = this.veiculos.filter(veiculo => veiculo.tipoVeiculo.tipoCarteira === tipoCarteira && !veiculo.baixado);
        if(veiculos.length === 0){
            console.log("Nenhum veículo disponível pra este tipo de habilitação");
        } else {
            console.log(`Segue abaixo todos os veículos para o tipo de carteira ${tipoCarteira.tipo}: `);
            const tabela = new Table({
                head: ["ID", "PLACA", "MODELO", "HABILITAÇÃO", "VALOR DIÁRIA", "DISPONÍVEL"],
                colWidths: [5, 10, 15, 15, 15, 15]
            })
            for (const veiculo of veiculos) {
                let valorDiaria = "R$" + veiculo.valorDiaria.toFixed(2);
                let disponivel = veiculo.disponivel ? "DISPONÍVEL".green : "INDISPONÍVEL".red;
                tabela.push([veiculo.id, veiculo.placa, veiculo.modelo, veiculo.tipoVeiculo.tipoCarteira.tipo, valorDiaria, disponivel])
            }
            console.log(tabela.toString());
        }
    }

    baixarVeiculo(veiculo: Veiculo){
        let indiceVeiculo = this._veiculos.indexOf(veiculo);
        this._veiculos[indiceVeiculo].baixado = true;
        this._veiculos[indiceVeiculo].disponivel = false;
    }

    cadastrarCliente(nome: string, cpf: string, tipoCarteiraId: number){
        if(!nome || !cpf || !tipoCarteiraId){
            throw new Error("Para cadastrar um cliente, deve ser informado nome, CPF e tipo de carteira");
        }
        const tipoCarteira = this.getTipoCarteiraById(tipoCarteiraId);
        if(!tipoCarteira){
            throw new Error("Tipo de carteira inválido! Por favor verifique");
        } else {
            cpf = formataCPF(cpf);
            const novoCliente = new Cliente(nome, cpf, tipoCarteira);
            this._clientes.push(novoCliente);
        }
    }

    listarClientes(){
        let clientes = this._clientes.filter(cliente => cliente.ativo);
        if(clientes.length === 0){
            console.log("Nenhum cliente cadastrado no momento");
        } else {
            console.log("Segue abaixo todos os clientes cadastrados no sistema: ");
            const tabela = new Table({
                head: ["ID", "NOME", "CPF", "HABILITAÇÃO", "AGUARDANDO DEVOLUÇÃO DE VEÍCULO", "ATIVO"],
                colWidths: [5, 40, 20, 15, 35, 10]
            });
            for (const cliente of clientes) {
                let veiculoAlugado = cliente.veiculoAlugado !== null ? "SIM".red : "NÃO".green;
                let ativo = cliente.ativo ? "SIM".green : "NÃO".red;
                tabela.push([cliente.id, cliente.nome, cliente.cpf, cliente.tipoCarteira.tipo, veiculoAlugado, ativo])
            }
            console.log(tabela.toString());
        }
    }

    listarClientesPorTermo(termo: string){
        const clientesPorTermo = this._clientes.filter(cliente => cliente.nome.toLowerCase().includes(termo.toLowerCase()));
        if(clientesPorTermo.length === 0){
            return `Nenhum cliente encontrado com o termo ${termo}`
        } else {
            console.log(`Segue abaixo todos os clientes cadastrados com o termo ${termo}`);
            const tabela = new Table({
                head: ["id", "CPF", "nome", "habilitação"],
                colsWidth: [5, 20, 150, 15]
            })
            for (const cliente of clientesPorTermo) {
                tabela.push([cliente.id, cliente.cpf, cliente.nome, cliente.tipoCarteira.tipo])
            }
            return tabela.toString();
            
        }
    }

    removerCliente(cliente: Cliente){
        let indiceCliente = this._clientes.indexOf(cliente);
        this._clientes[indiceCliente].ativo = false;
    }

    registrarLocacao(idCliente: number, idVeiculo: number, dataLocacao: Date, dataPrevistaDevolucao: Date){
        if(!idCliente || !idVeiculo || !dataLocacao || !dataPrevistaDevolucao){
            throw new Error("Data de locação, previsão de devolução, id do cliente e id do veículo precisam ser informados");
        }
        const veiculo = this.getVeiculoById(idVeiculo);
        if (!veiculo) {
            throw new Error("Id do veículo informado é inválido, pois o veículo não existe ou já foi baixado");
            
        }
        const indiceVeiculo = this.veiculos.indexOf(veiculo);
        const cliente = this.getClienteById(idCliente);
        const indiceCliente = this.clientes.indexOf(cliente);
        if(!veiculo.disponivel){
            throw new Error(`O veículo ${veiculo.modelo} com placa ${veiculo.placa} não pode ser alugado, pois ele se encontra indisponível, está alugado para o cliente ${this.getClienteById(veiculo.alugadoPara).nome}`);
        }
        if(veiculo.tipoVeiculo.tipoCarteira !== cliente.tipoCarteira){
            throw new Error(`O veículo ${veiculo.modelo} com placa ${veiculo.placa} não pode ser alugado para o cliente ${cliente.nome} com CPF ${cliente.cpf}, pois este cliente não possui habilitação para este tipo de veículo`);
        }
        else {
            const locacao = new Locacao(idCliente, idVeiculo, dataLocacao, dataPrevistaDevolucao);
            locacao.valorDiaria = veiculo.valorDiaria;
            this._veiculos[indiceVeiculo].disponivel = false;
            this._veiculos[indiceVeiculo].alugadoPara = idCliente;
            this._veiculos[indiceVeiculo].dataUltimaLocacao = dataLocacao;
            this._veiculos[indiceVeiculo].dataPrevistaDevolucao = dataPrevistaDevolucao;
            this._clientes[indiceCliente].historico.push(locacao.id);
            this._clientes[indiceCliente].veiculoAlugado = idVeiculo;
            this._locacoes.push(locacao);
        }
    }

    registrarDevolucao (id: number, dataDevolucao: Date, nDias: number) {
        const locacao = this.getLocacaoById(id);
        const indiceLocacao= this._locacoes.indexOf(locacao);
        if(locacao.finalizado){
            throw new Error("Esta locação já foi finalizada!")
        } else {
            const veiculo = this.getVeiculoById(locacao.idVeiculo);
            const indiceVeiculo = this._veiculos.indexOf(veiculo);
            const cliente = this.getClienteById(locacao.idCliente);
            const indiceCliente = this._clientes.indexOf(cliente);
            this._veiculos[indiceVeiculo].disponivel = true;
            this._veiculos[indiceVeiculo].alugadoPara = null;
            this._veiculos[indiceVeiculo].dataPrevistaDevolucao = null;
            this._veiculos[indiceVeiculo].dataUltimaLocacao = null;
            this._clientes[indiceCliente].veiculoAlugado = null;
            this._locacoes[indiceLocacao].finalizado = true;
            this._locacoes[indiceLocacao].dataDevolucao = dataDevolucao;
            this._locacoes[indiceLocacao].nDias = nDias;
            this._locacoes[indiceLocacao].acrescimo = veiculo.tipoVeiculo.acrescimo;
        }
    }

    listarLocacoesPorCliente(id: number){
        const locacoesCliente = this._locacoes.filter(locacao => locacao.idCliente === id);
        if(locacoesCliente.length === 0){
            return false;
        } else {
            const tabela = new Table({
                head: ["ID LOCAÇÃO", "VEÍCULO", "PLACA", "DATA LOCAÇÃO", "PREVISÃO DEVOLUÇÃO", "DATA DEVOLUÇÃO", "SITUAÇÃO"],
                colWidths: [10, 20, 10, 15, 20, 25, 25]
            })
            for (const locacao of locacoesCliente) {
                let veiculo = this.getVeiculoById(locacao.idVeiculo);
                let situacao = locacao.finalizado ? "FINALIZADA".green : "AGUARDANDO DEVOLUÇÃO".red;
                let dataDevolucao = locacao.dataDevolucao ? formataData(locacao.dataDevolucao).green : "AGUARDANDO DEVOLUÇÃO".red;
                tabela.push([locacao.id, veiculo.modelo, veiculo.placa, formataData(locacao.dataLocacao), formataData(locacao.dataPrevistaDevolucao), dataDevolucao, situacao])
            }
            return tabela.toString();
        }
    }

    listaLocacoesFinalizadas(){
        const locacoesFinalizadas = this._locacoes.filter(locacao => locacao.finalizado);
        if (locacoesFinalizadas.length === 0) {
            return `Não existem faturas finalizadas`
        } else {
            console.log("Segue abaixo as faturas aguardando emissão");
            const tabela = new Table({
                head: ["ID FATURA", "CLIENTE", "VEÍCULO", "PLACA", "DATA LOCAÇÃO", "DATA DEVOLUÇÃO", "Nº DE DIAS"],
                colWidths: [10, 20, 20, 15, 20, 20, 15]
            })
            for (const locacao of locacoesFinalizadas) {
                let veiculo = this.getVeiculoById(locacao.idVeiculo);
                let cliente = this.getClienteById(locacao.idCliente);
                tabela.push([locacao.id, cliente.nome, veiculo.modelo, veiculo.placa, formataData(locacao.dataLocacao), formataData(locacao.dataDevolucao), locacao.nDias])
            }
            return tabela.toString();
        }
    }

    listaLocacoesFinalizadasCliente(id: number){
        const locacoesCliente = this._locacoes.filter(locacao => locacao.idCliente === id && locacao.finalizado);
        if (locacoesCliente.length === 0) {
            return `Não existem faturas a emitir para este cliente`
        } else {
            console.log("Segue abaixo as faturas deste cliente");
            const tabela = new Table({
                head: ["ID", "VEÍCULO", "PLACA","DATA LOCAÇÃO", "DATA DEVOLUÇÃO", "Nº DE DIAS"],
                colWidths: [5, 20, 15, 20, 20, 15]
            })
            for (const locacao of locacoesCliente) {
                let veiculo = this.getVeiculoById(locacao.idVeiculo)
                tabela.push([locacao.id, veiculo.modelo, veiculo.placa, formataData(locacao.dataLocacao), formataData(locacao.dataDevolucao), locacao.nDias])
            }
            return tabela.toString();
        }
    }

    listaVeiculosBaixados(){
        const veiculos = this._veiculos.filter(veiculo => veiculo.baixado);
        if (veiculos.length === 0) {
            return "Não existem veículos baixados neste momento";
        } else {
            console.log("Segue abaixo todos os veículos baixados no sistema: ");
            const tabela = new Table({
                head: ["ID", "PLACA", "MODELO", "HABILITAÇÃO", "VALOR DIÁRIA", "SITUAÇÃO"],
                colWidths: [5, 10, 15, 15, 15, 20]
            })
            for (const veiculo of veiculos) {
                let valorDiaria = "R$" + veiculo.valorDiaria.toFixed(2);
                let situacao = "VEÍCULO BAIXADO".red;
                tabela.push([veiculo.id, veiculo.placa, veiculo.modelo, veiculo.tipoVeiculo.tipoCarteira.tipo, valorDiaria, situacao])
            }
            return tabela.toString();
        }
    }

    listaClientesInativos(){
        const clientesInativos = this._clientes.filter(cliente => !cliente.ativo);
        if(clientesInativos.length === 0){
            return `Nenhum cliente inativo no momento`;
        } else {
            console.log(`Segue abaixo todos os clientes inativos no sistema`);
            const tabela = new Table({
                head: ["ID", "CPF", "NOME", "HABILITAÇÃO", "SITUAÇÃO"],
                colsWidth: [5, 20, 150, 15, 20]
            })
            for (const cliente of clientesInativos) {
                let situacao = "INATIVO/REMOVIDO".red;
                tabela.push([cliente.id, cliente.cpf, cliente.nome, cliente.tipoCarteira.tipo, situacao]);
            }
            return tabela.toString();
        }
    }

    reativarVeiculo(veiculo: Veiculo){
        let indiceVeiculo = this._veiculos.indexOf(veiculo);
        this._veiculos[indiceVeiculo].baixado = false;
    }

    reativarCliente(cliente: Cliente){
        let indiceCliente = this._clientes.indexOf(cliente);
        this._clientes[indiceCliente].ativo = true;
    }
}

export {Locadora}