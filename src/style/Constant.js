  const drinkerOptions = [
    "Non-Smoker",
    "Social Smoker",
    "Regular Smoker",
    "Never Drink",
    "Social Drinker",
    "Regular Drinker"
  ];

    const LifeStyleOptions = drinkerOptions.map(pref=>({
    value:pref,
    label:pref,
  }
  ))
 const preferencesOptions = [
  { label: 'Option A', value: 'option_a' },
  { label: 'Option B', value: 'option_b' }
];
  export {
  
  drinkerOptions,
  preferencesOptions,
  LifeStyleOptions
}
