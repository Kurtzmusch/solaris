<template>
  <div id="gameContainer"></div>
</template>

<script>
import { mapState } from 'vuex'
import GameContainer from '../../game/container'

export default {
  data () {
    return {
      onStarDoubleClickedHandler: null,
      onStarRightClickedHandler: null,
      onCarrierClickedHandler: null,
      onWaypointCreatedHandler: null,
      onObjectsClickedHandler: null
    }
  },

  created () {
    window.addEventListener('resize', this.handleResize)
  },

  beforeMount () {
    this.gameContainer = GameContainer
    this.gameContainer.setupApp()
    this.loadGame(this.$store.state.game)
  },

  mounted () {
    // Add the game canvas to the screen.
    this.$el.appendChild(this.gameContainer.app.view) // Add the pixi canvas to the element.

    this.drawGame(this.$store.state.game)

    // Bind to game events.
    this.onStarDoubleClickedHandler = this.onStarDoubleClicked.bind(this)
    this.onStarRightClickedHandler = this.onStarRightClicked.bind(this)
    this.onCarrierDoubleClickedHandler = this.onCarrierDoubleClicked.bind(this)
    this.onCarrierRightClickedHandler = this.onCarrierRightClicked.bind(this)
    this.onWaypointCreatedHandler = this.onWaypointCreated.bind(this)
    this.onObjectsClickedHandler = this.onObjectsClicked.bind(this)

    this.gameContainer.map.on('onStarDoubleClicked', this.onStarDoubleClickedHandler)
    this.gameContainer.map.on('onStarRightClicked', this.onStarRightClickedHandler)
    this.gameContainer.map.on('onCarrierDoubleClicked', this.onCarrierDoubleClickedHandler)
    this.gameContainer.map.on('onCarrierRightClicked', this.onCarrierRightClickedHandler)
    this.gameContainer.map.on('onWaypointCreated', this.onWaypointCreatedHandler)
    this.gameContainer.map.on('onObjectsClicked', this.onObjectsClickedHandler)
  },

  destroyed () {
    this.gameContainer.map.off('onStarDoubleClicked', this.onStarDoubleClickedHandler)
    this.gameContainer.map.off('onStarRightClicked', this.onStarRightClickedHandler)
    this.gameContainer.map.off('onCarrierDoubleClicked', this.onCarrierDoubleClickedHandler)
    this.gameContainer.map.off('onCarrierRightClicked', this.onCarrierRightClickedHandler)
    this.gameContainer.map.off('onWaypointCreated', this.onWaypointCreatedHandler)
    this.gameContainer.map.off('onObjectsClicked', this.onObjectsClickedHandler)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    loadGame (game) {
      this.gameContainer.setupViewport(game)
      this.gameContainer.setup(game)
    },
    updateGame (game) {
      this.gameContainer.reloadGame(game)
    },
    drawGame (game, panToUser = true) {
      this.gameContainer.draw()

      if (panToUser) {
        this.gameContainer.map.panToUser(game)
      }
    },
    handleResize (e) {
      this.gameContainer.app.renderer.resize(
        window.innerWidth,
        window.innerHeight
      )
    },
    onStarDoubleClicked (e) {
      this.$emit('onStarDoubleClicked', e._id)
    },
    onStarRightClicked (e) {
      this.$emit('onStarRightClicked', e._id)
    },
    onCarrierDoubleClicked (e) {
      this.$emit('onCarrierDoubleClicked', e._id)
    },
    onCarrierRightClicked (e) {
      this.$emit('onCarrierRightClicked', e._id)
    },
    onWaypointCreated (e) {
      this.$emit('onWaypointCreated', e)
    },
    onObjectsClicked (e) {
      this.$emit('onObjectsClicked', e)
    }
  },

  computed: mapState(['game']),

  watch: {
    game (newGame, oldGame) {
      this.updateGame(newGame)
    }
  }
}
</script>

<style scoped>
#gameContainer {
  position: absolute;
  z-index: -1;
  left: 0;
  top: 0;
  margin: 0;
  height: 100%;
  overflow: hidden;
}
</style>
