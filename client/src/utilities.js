/*
// *** this is just a note ***
totalSumData =
  {
    US: {
      'Seattle, WA': { totalConfirm: 4, totalDeath: 1, totalRecovered: 6 },
      'New York, NY': { totalConfirm: 31, totalDeath: 2, totalRecovered: 9 }
    },
    Thailand: { Thailand: { totalConfirm: 4, totalDeath: 1, totalRecovered: 6 } },
    China: {
      Wuhan: { totalConfirm: 4, totalDeath: 1, totalRecovered: 6 },
      Beijing: { totalConfirm: 4, totalDeath: 1, totalRecovered: 510 }
    }
  }

  
return (

  < div >
    {
      fakeData.map((data) => (
        <div key={data.Id}>
          <h2>{data.Country}</h2>
          <div>
            {data.RegionalData.map((region) => (
              <div>
                <h3>{region.Region}</h3>
                <div>
                  <h3>Confirmed Cases</h3>
                  {region.Confirmed.map((dailyCase) => (
                    <div>
                      <p>{dailyCase.date}</p>
                      <p>{dailyCase.newConfirmedCases}</p>
                    </div>
                  ))}
                  <h3>Death</h3>
                  {region.Death.map((death) => (
                    <div>
                      <p>{death.date}</p>
                      <p>{death.newDeathCases}</p>
                    </div>
                  ))}
                  <h3>Recovered</h3>
                  {region.Recovered.map(recovered => (
                    <div>
                      <p>{recovered.date}</p>
                      <p>{recovered.newRecoveredCases}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))
    }
  </div >
)


const sumData = (data) => {
  let total = {}
  data.forEach(country => {
    //country at idx0, country.Country = 'US', country.RegionalData = [{...}]
    let countryName = country.Country
    let dataOfEachRegion
    let regionName
    total[countryName] = {}
    //regionals at idx0, regionals.Region = 'Seattle, WA'
    country.RegionalData.forEach(region => {
      regionName = region.Region
      let totalConfirm = 0
      let totalDeath = 0
      let totalRecovered = 0
      region.Confirmed.forEach(confirmCase => {
        totalConfirm += confirmCase.newConfirmedCases

      })
      region.Death.forEach(deathCase => {
        totalDeath += deathCase.newDeathCases
      })
      region.Recovered.forEach(recoverCase => {
        totalRecovered += recoverCase.newRecoveredCases
      })
      dataOfEachRegion = { totalConfirm, totalDeath, totalRecovered }
      total[countryName][regionName] = {}
      total[countryName][regionName] = dataOfEachRegion


    })

  })
  return total
}
*/