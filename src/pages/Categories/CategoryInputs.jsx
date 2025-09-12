import { component } from '@dark-engine/core'

const CategoryInputs = component(() => {
  return (
    <>
      <StyledLabel onClick={handleLabelClick}>
        {t('name')}
        <input
          type='text'
          name='name'
          required
          data-locale-id={defaultLocaleId}
          value={getValue(defaultLocaleId, 'name')}
          onInput={handleInput}
        />
      </StyledLabel>

      <StyledLabel onClick={handleLabelClick}>
        {t('description')}
        <input
          type='text'
          name='description'
          data-locale-id={defaultLocaleId}
          value={getValue(defaultLocaleId, 'description')}
          onInput={handleInput}
        />
      </StyledLabel>

      <StyledLabel onClick={handleLabelClick}>
        {t('handle')}
        <input
          type='text'
          name='handle'
          value={categoryData.handle}
          onInput={handleInput}
        />
      </StyledLabel>

      <StyledLabel onClick={handleLabelClick}>
        {t('visibility')}
        <input
          type='checkbox'
          name='isInternal'
          value={categoryData.isInternal}
          onChange={handleInput}
        />
      </StyledLabel>

      <StyledLabel onClick={handleLabelClick}>
        {t('status')}
        <input
          type='checkbox'
          name='isActive'
          value={categoryData.isActive}
          onChange={handleInput}
        />
      </StyledLabel>
    </>
  )
})
