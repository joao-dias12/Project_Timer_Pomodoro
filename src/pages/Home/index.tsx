import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' // sintax de importação para bibliotecas sem export default


import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

// controlled(manter em tempo real o estado, valor atualizado do estado) - usando "Onchange", usado para formulatios simples
// uncontrolled

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'), // o objeto "task" deve ter no minimo 1 caracter, caso não digite, vai ter uma mensagem"informe uma tarefa
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'), // minutesAmount é um numero de valor minimo 5 e maximo 60. mensagem de validação ao lado
})
//
export function Home() {
  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(newCycleFormValidationSchema),
  }) // useForm retorna um objeto com varias funções e variaveis.
  // register vai adicionar um input ao formulário. register recebe o nome do input e retorna metodos para trabalhar com inputs. ex: Onchange, onFocus, etc.
  // handleSubmit vai gatilhar quando o formula´rio for submetido
  // watch vai monitorar o campo "task"

  function handleCreateNewCycle(data: any) {
    console.log(data)
  }

  const task = watch('task')
  const isSubmitDisable = !task // Vai estar desabilitado quando o campo "task" estiver vazio

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')} // spreadoperator devolver os atributos que o o "register" já traz como herança. Tudo que o register já tem dentro dele
            // lista de opções de task, sugestões, como se fosse um campo Choices. A função recebe um nome, esse nome é o "name" do input criado pela própia "register"
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5} // Aumenta de 5 em os segundos
            min={5} // valor minimo
            max={60} // valor máximo
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisable} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
