const InputOriginCountry = component(({ label, value, onChangeHandler }) => {
  const { data } = useCountries({ fetch: 250 })
  const { translator } = useTranslation()

  if (data) {
    const { countries } = data
    const options = []
    options.push(<option value='' disabled hidden />)
    for (let i = 0, len = countries.length; i < len; i++) {
      const country = countries[i]
      const { code } = country
      options.push(
        <option key={code} value={code}>
          {code} ({translator.formatName(code.trim(), { type: 'region' })})
        </option>
      )
    }

    return (
      <label>
        {label}
        <select
          name='originCountry'
          autoComplete='off'
          value={value}
          onChange={onChangeHandler}
        >
          {options}
        </select>
      </label>
    )
  }

  return null
})


  < label onClick = { handleLabelClick } >
    { t ('sku') }
    < input
type = 'text'
maxLength = { 63}
autoComplete = 'off'
name = 'sku'
onInput = { handleInput }
value = { variantData.sku }
placeholder = { t ('skuPlaceholder') }
  />
        </label >
  <fieldset>
    <label onClick={handleLabelClick}>
      {t('hsCode')}
      <input
        type='text'
        maxLength={63}
        autoComplete='off'
        name='hsCode'
        onInput={handleInput}
        value={variantData.hsCode}
        placeholder={t('hsCodePlaceholder')}
      />
    </label>
    <label onClick={handleLabelClick}>
      {t('midCode')}
      <input
        type='text'
        maxLength={63}
        autoComplete='off'
        name='midCode'
        onInput={handleInput}
        value={variantData.midCode}
        placeholder={t('midCodePlaceholder')}
      />
    </label>
    <label onClick={handleLabelClick}>
      {t('material')}
      <input
        type='text'
        maxLength={191}
        name='material'
        onInput={handleInput}
        value={variantData.material}
        placeholder={t('materialPlaceholder')}
      />
    </label>
    <InputOriginCountry
      label={t('originCountry')}
      value={variantData.originCountry}
      onChangeHandler={handleInput}
    />

    <label onClick={handleLabelClick}>
      {t('weight')}
      <input
        type='number'
        step={1}
        autoComplete='off'
        name='weight'
        onInput={handleInput}
        value={variantData.weight}
        placeholder={t('weightPlaceholder')}
      />
    </label>
    <label onClick={handleLabelClick}>
      {t('length')}
      <input
        type='number'
        step={1}
        autoComplete='off'
        name='length'
        onInput={handleInput}
        value={variantData.length}
        placeholder={t('lengthPlaceholder')}
      />
    </label>
    <label onClick={handleLabelClick}>
      {t('height')}
      <input
        type='number'
        step={1}
        autoComplete='off'
        name='height'
        onInput={handleInput}
        value={variantData.height}
        placeholder={t('heightPlaceholder')}
      />
    </label>
    <label onClick={handleLabelClick}>
      {t('width')}
      <input
        type='number'
        step={1}
        autoComplete='off'
        name='width'
        onInput={handleInput}
        value={variantData.width}
        placeholder={t('widthPlaceholder')}
      />
    </label>
  </fieldset>
