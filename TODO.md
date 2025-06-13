# TODO

## Features

- [x] Log in
- [ ] Log out
- [ ] Manage store
- [ ] Create/edit products
- [ ] Create/edit variants
- [ ] Create/edit categories
- [ ] Create/edit prices
- [ ] Create/edit price lists
- [ ] Create/edit currencies
- [ ] Create/edit taxes
- [ ] Create/edit regions
- [ ] Create/edit sales channels

## Optimizations

- [ ] Responsiveness

## Problems

- [`@dark-engine/styled` has CSS order issues](https://github.com/atellmer/dark/issues/72)

## Dark notes

- Clicking a `<Link to='/nl/'>` redirects to `/nl`. To prevent unnecessary rerenders, provide paths 
  without trailing slashes to Link components.
