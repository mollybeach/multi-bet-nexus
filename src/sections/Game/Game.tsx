import { multi-bet-nexusUi, useSoundStore } from 'multi-bet-nexus-react-ui-v2'
import React from 'react'
import { useParams } from 'react-router-dom'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'
import { GAMES } from '../../games'
import { useUserStore } from '../../hooks/useUserStore'
import { GameSlider } from '../Dashboard/Dashboard'
import { Container, Controls, IconButton, MetaControls, Screen, Splash } from './Game.styles'
import { LoadingBar } from './LoadingBar'
import { ProvablyFairModal } from './ProvablyFairModal'
// import { TransactionModal } from './TransactionModal'

function CustomError() {
  return (
    <>
      <multi-bet-nexusUi.Portal target="error">
        <multi-bet-nexusUi.Responsive>
          <h1>😭 Oh no!</h1>
          <p>Something went wrong</p>
        </multi-bet-nexusUi.Responsive>
      </multi-bet-nexusUi.Portal>
    </>
  )
}

/**
 * A renderer component to display the contents of the loaded multi-bet-nexusUi.Game
 * Screen
 * Controls
 */
function CustomRenderer() {
  const { game } = multi-bet-nexusUi.useGame()
  const [info, setInfo] = React.useState(false)
  const [provablyFair, setProvablyFair] = React.useState(false)
  const soundStore = useSoundStore()
  const firstTimePlaying = useUserStore((state) => !state.gamesPlayed.includes(game.id))
  const markGameAsPlayed = useUserStore((state) => () => state.markGameAsPlayed(game.id, true))
  const [ready, setReady] = React.useState(false)

  React.useEffect(
    () => {
      const timeout = setTimeout(() => {
        setReady(true)
      }, 750)
      return () => clearTimeout(timeout)
    },
    [],
  )

  React.useEffect(
    () => {
      const timeout = setTimeout(() => {
        setInfo(firstTimePlaying)
      }, 1000)
      return () => clearTimeout(timeout)
    },
    [firstTimePlaying],
  )

  const closeInfo = () => {
    markGameAsPlayed()
    setInfo(false)
  }

  return (
    <>
      {info && (
        <Modal onClose={() => setInfo(false)}>
          <h1>
            <img height="100px" title={game.meta.name} src={game.meta.image} />
          </h1>
          <p>{game.meta.description}</p>
          <multi-bet-nexusUi.Button main onClick={closeInfo}>
            Play
          </multi-bet-nexusUi.Button>
        </Modal>
      )}
      {provablyFair && (
        <ProvablyFairModal onClose={() => setProvablyFair(false)} />
      )}
      {/* {txModal && (
        <TransactionModal onClose={() => setTransactionModal(false)} />
      )} */}
      <Container>
        <Screen>
          <Splash>
            <img height="150px" src={game.meta.image} />
          </Splash>
          <multi-bet-nexusUi.PortalTarget target="error" />
          {ready && <multi-bet-nexusUi.PortalTarget target="screen" />}
          <MetaControls>
            <IconButton onClick={() => setInfo(true)}>
              <Icon.Info />
            </IconButton>
            <IconButton onClick={() => setProvablyFair(true)}>
              <Icon.Fairness />
            </IconButton>
            <IconButton onClick={() => soundStore.set(soundStore.volume ? 0 : .5)}>
              {soundStore.volume ? <Icon.Volume /> : <Icon.VolumeMuted />}
            </IconButton>
          </MetaControls>
        </Screen>
        <LoadingBar />
        <Controls>
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* <div style={{ display: 'flex' }}>
              <IconButton onClick={() => setTransactionModal(true)}>
                {loading === -1 ? (
                  <Icon.Shuffle />
                ) : (
                  <Spinner />
                )}
              </IconButton>
            </div> */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <multi-bet-nexusUi.PortalTarget target="controls" />
              <multi-bet-nexusUi.PortalTarget target="play" />
            </div>
          </div>
        </Controls>
      </Container>
    </>
  )
}

export default function Game() {
  const { gameId } = useParams()
  const game = GAMES.find((x) => x.id === gameId)

  return (
    <>
      {game ? (
        <multi-bet-nexusUi.Game
          game={game}
          errorFallback={<CustomError />}
          children={<CustomRenderer />}
        />
      ) : (
        <h1>Game not found! 👎</h1>
      )}
      <GameSlider />
    </>
  )
}
