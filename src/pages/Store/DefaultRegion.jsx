import { useRegionById } from '../../data'

// TODO return all info on hover
const DefaultRegion = ({ regionId }) => {
  const { data: regionData } = useRegionById(regionId)
  if (regionData) {
    const { region } = regionData
    return region.name
  }
}

export default DefaultRegion
