import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' // sintax de importação para bibliotecas sem export default
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
  StopCountdownButton,
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

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date // Data que o timer ficou ativo
  interruptedDate?: Date // Vai ser para armazenar as tasks que foram interrompidas
  finishedDate?: Date // data em que o ciclo foi finalizado
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]) // estado para armazenar uma lista de ciclos, ou seja um objeto que tem typagem compativel a interface(cycle)
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // criando estado para armazenar ciclo ativo. como começa sem nenhum ciclo, o estado incial é null mas a typagme é string ou null
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // state para armazenar os segundos passando
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  }) // useForm retorna um objeto com varias funções e variaveis.
  // register vai adicionar um input ao formulário. register recebe o nome do input e retorna metodos para trabalhar com inputs. ex: Onchange, onFocus, etc.
  // handleSubmit vai gatilhar quando o formula´rio for submetido
  // watch vai monitorar o campo "task"
  // defaultValues dá o valor inicial de cada campo

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )

          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }
    return () => {
      // retorno de um useEffect é sempre uma função.
      clearInterval(interval) // limpando os intervalos anteriores e mantendo só a contagem.
    }
  }, [activeCycle, totalSeconds, activeCycleId]) // Se eu tiver um ciclo ativo. vamos setar o quando de segundos que passaram sendo a diferença entre a data do inicio do ciclo com a data atual.

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime()) // Criando uma id para a aplicação

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(), // A data que o ciclo iniciou
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id) // Como a gente não usa o spread, o estado setado é apenas o ciclo setado
    setAmountSecondsPassed(0) // resetando quantos segundos se passaram

    reset()
    // limpa os valores depois do gatilho. mas para isso é necessario criar o "defaultValues"!
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() } // Registrando a data em que o ciclo foi interrompido
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60) // arredondando para baixo usando o "floor"
  const secondsAmount = currentSeconds % 60 // resto da divisão para pegar os segundos.

  const minutes = String(minutesAmount).padStart(2, '0') // Se a variavel tiver dois caracteres, mantém, caso tenha apenas 1, colocar o '0' no começo
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      // a contagem só começa se existir algum ciclo
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle]) // Mexendo no title para ele acompnhar a contagem

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
            disabled={!!activeCycle} // dasabilitando o formulário caso esteja alguma ciclo ativo. a exclamação converte para boolean.
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
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? ( // se eu tiver o ciclo ja rolando eu vou fazer algo
          <StopCountdownButton onClick={handleInterruptCycle} type="button"> {/* Chamando o handleinterrupt quando clicar   */}
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : ( // se não, eu vou fazer a coisa aqui de baixo
          <StartCountdownButton disabled={isSubmitDisable} type="submit">
            {' '}
            {/* estado se o ciclo não tiver começado */}
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
