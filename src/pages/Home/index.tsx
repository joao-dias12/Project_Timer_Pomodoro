import { Play } from 'phosphor-react'
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

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)
    }
    return () => { // retorno de um useEffect é sempre uma função.
      clearInterval(interval) // limpando os intervalos anteriores e mantendo só a contagem.
    }
  }, [activeCycle]) // Se eu tiver um ciclo ativo. vamos setar o quando de segundos que passaram sendo a diferença entre a data do inicio do ciclo com a data atual.

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

    reset()
    // limpa os valores depois do gatilho. mas para isso é necessario criar o "defaultValues"!
  }

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 // se eu tiver um ciclo ativo, essa variavel vai ser o minutesamount vezes 60, se não (:) ela vai ser igual a 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60) // arredondando para baixo usando o "floor"
  const secondsAmount = currentSeconds % 60 // resto da divisão para pegar os segundos.

  const minutes = String(minutesAmount).padStart(2, '0') // Se a variavel tiver dois caracteres, mantém, caso tenha apenas 1, colocar o '0' no começo
  const seconds = String(secondsAmount).padStart(2, '0')

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
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisable} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
