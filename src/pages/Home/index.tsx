import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'

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

export function Home() {
  const { register, handleSubmit, watch } = useForm() // useForm retorna um objeto com varias funções e variaveis.
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
