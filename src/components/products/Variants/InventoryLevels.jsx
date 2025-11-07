import { component } from '@dark-engine/core'

// This component requires the inventory item to already exist
// TODO change peony API: add properties to variant creation object
const InventoryLevels = component(({ inventoryItemId }) => {
  // get stock locations
  // for each stock location input i32
  // TODO implement stock_location route, conduit, model in peony
})

export default InventoryLevels
