import { useStockLocationById } from '../../data'

// TODO return all info on hover
const DefaultStockLocation = ({ stockLocationId }) => {
  const { data: stockLocationData } = useStockLocationById(stockLocationId)
  if (stockLocationData) {
    const { stockLocation } = stockLocationData
    return stockLocation.name
  }
}

export default DefaultStockLocation
