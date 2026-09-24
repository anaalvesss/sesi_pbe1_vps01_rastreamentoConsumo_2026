const express = require("express")
const cors = require("cors")
const equipamentos = require("./dados.json")
function autoIncrement() {
    let maiorId = 0
    equipamentos.forEach(item => {
        if (item.id > maiorId) {
            maiorId = item.id
        }
    })
    return maiorId + 1
}
const rotaInicial = (req, res) => {
    res.json("Back-end de rastreamento de consumo respondendo!")
}
const createEquipamento = (req, res) => {
    const equipamento = req.body
    equipamento.id = autoIncrement()
    equipamentos.push(equipamento)
    res.status(201).json(equipamento)
}
const readEquipamentos = (req, res) => {
    const { local, equipamento } = req.query
    let resultado = equipamentos
    if (local) {
        resultado = resultado.filter(item => item.local.toLowerCase().includes(local.toLowerCase()))
    }
    if (equipamento) {
        resultado = resultado.filter(item => item.equipamento.toLowerCase().includes(equipamento.toLowerCase()))
    }
    res.json(resultado)
}
const buscaEquipamento = (req, res) => {
    const equipamento = equipamentos.find(item => item.id == Number(req.params.id))
    
    if (equipamento) {
        res.json(equipamento)
    } else {
        res.status(404).json("Id não encontrado")
    }
}

const updateEquipamento = (req, res) => {
    const id = req.params.id
    const dadosAtualizados = req.body
    dadosAtualizados.id = Number(id)
    const equipamentoExiste = equipamentos.find(item => item.id == id)

    if (equipamentoExiste) {
        equipamentos.forEach((item, indice) => {
            if (item.id == id) {
                equipamentos[indice] = dadosAtualizados
            }
        })
        res.status(202).json(dadosAtualizados)
    } else {
        res.status(404).send("Equipamento não encontrado.")
    }
}
const deleteEquipamento = (req, res) => {
    const id = req.params.id
    const equipamentoExiste = equipamentos.find(item => item.id == id)

    if (equipamentoExiste) {
        equipamentos.forEach((item, indice) => {
            if (item.id == id) {
                equipamentos.splice(indice, 1)
            }
        })
        res.json("Equipamento excluído com sucesso!")
    } else {
        res.status(404).send("O equipamento não encontrado.")
    }
}
const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const porta = 3000

app.get('/', rotaInicial)
app.post('/equipamentos', createEquipamento)
app.get('/equipamentos', readEquipamentos)        
app.get('/equipamentos/:id', buscaEquipamento)    
app.put('/equipamentos/:id', updateEquipamento)
app.delete('/equipamentos/:id', deleteEquipamento)

app.listen(porta, () => {
    console.log(`Servidor respondendo em: http://localhost:${porta}`)
})
