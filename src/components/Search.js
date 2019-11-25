import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import Matches from './MatchedCompanies'
import MatchedCompanies from './MatchedCompanies'

const Search = () => {
  const [companyList, setCompanyList] = useState(null)
  const [searchMatches, setSearchMatches] = useState([])
  const [currentSearch, setCurrentSearch] = useState([])
  const [stockHistory, setStockHistory] = useState(null)
  const [timeseriesData, setTimeseriesData] = useState(null)
  const searchInputEl = useRef(null)

  // Base IEX Stock API config variables - public facing
  const iexBase = 'https://cloud.iexapis.com/v1'
  const iexPublicKey = 'pk_5f23b767a4374ec393a736d3f05fe351'

  // Fetch full list of available companies on mount
  useEffect(() => {
    const fetchCompanyList = async () => {
      try {
        const fetchedCompanyListResponse = await axios.get(
          `${iexBase}/ref-data/symbols/?token=${iexPublicKey}`
        )
        if (fetchedCompanyListResponse.status !== 200) {
          throw Error('no bueno')
        }

        setCompanyList(fetchedCompanyListResponse.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchCompanyList()
  }, [])

  useEffect(() => {
    if (!!stockHistory) {
      const formattedTimeseries = JSON.stringify({
        data: stockHistory.data.map(pointInTime => ({
          timestamp: timestampToUnix(pointInTime.date),
          value: pointInTime.close,
        })),
      })
      setTimeseriesData(formattedTimeseries)
    }
  }, [stockHistory])

  const timestampToUnix = timestamp =>
    parseInt((new Date(timestamp).getTime() / 1000).toFixed(0))

  // Filter total list of companies by name/symbol based on search input
  const changeHandler = e => {
    const { value } = e.target
    const formattedValue = value.toLowerCase()

    const matches = companyList.filter(
      company =>
        company.name.toLowerCase().includes(formattedValue) ||
        company.symbol.toLowerCase().includes(formattedValue)
    )

    setCurrentSearch(formattedValue)
    setSearchMatches(matches.slice(0, 10))
  }

  // Get Historical stock prices, given a symbol
  const getSymbolHistory = async e => {
    e.preventDefault()
    console.log(currentSearch)
    try {
      const response = await axios.get(
        `${iexBase}/stock/${currentSearch}/chart/?token=${iexPublicKey}`
      )
      setStockHistory(response)
    } catch (error) {
      !!searchMatches && retrySymbolHistory(searchMatches[0])
      console.error(error)
    }
  }

  const retrySymbolHistory = async firstMatch => {
    try {
      setCurrentSearch(firstMatch.symbol)
      const response = await axios.get(
        `${iexBase}/stock/${firstMatch.symbol}/chart/?token=${iexPublicKey}`
      )
      console.log(response)
      setStockHistory(response)
    } catch (error) {
      console.error(error)
    }
  }

  // Select company from <MatchedCompanies /> and set it as the current search.
  const selectCompany = company => {
    setCurrentSearch(company.symbol)
    searchInputEl.current.focus()
  }

  return (
    <>
      <form onSubmit={getSymbolHistory}>
        <input
          ref={searchInputEl}
          type="text"
          placeholder="search your shit"
          onChange={changeHandler}
          value={currentSearch}
        />
      </form>
      <MatchedCompanies matches={searchMatches} selectCompany={selectCompany} />
    </>
  )
}

export default Search
