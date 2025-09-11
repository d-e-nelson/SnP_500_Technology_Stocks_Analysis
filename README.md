# S&P500_Technology_Stocks_Analysis

## Introduction
In this analysis I will be taking a look at ticker data from stocks in the Information Technology sector of the S&P 500 collected from the start of 2014 to the end of 2017, and all price values in the data set are in USD.

### Columns in Tech_data.csv
1. symbol: This is the ticker symbol for the stock. Ex: AAPL
2. date: The date of the stock's entry.
3. open: The price that the stock opened the day at.
4. high: The highest price the stock recorded for the day.
5. low: The lowest price that stock recorded for the day.
6. close: The price the stock held at the end of the day.
7. volume: The day's trading volume for the stock.
8. Security: The public name of the company that holds the stock. Ex: Apple Inc.
9. GICS.Sector: The wider sector the stock is part of.
10. GICS.Sub.Industry: The sub sector of the sector the stock occupies. Ex: IT Consulting & Other Services

## Data Set Construction
Tech_data.csv is was constructed by combining two seperate data sets and then selecting out a subset of the larger data set that comprised just GICS.Sector data from the Information Technoloy sector. 

**Original Data Set** ([link](https://www.kaggle.com/datasets/mysarahmadbhat/stock-prices)): Contains stock time series information. The columns it contains include the stock's symbol, date, open, high, low, and close. 

**Added Data Set** ([link](https://en.wikipedia.org/wiki/List_of_S%26P_500_companies?utm_source=chatgpt.com)): This data set contains master data on individual stocks. The data that it provides is the stock's symbol, its security, GICS Sector, and GICS Sub-Industry. 

The two data sets were linked together using the stock symbols as a common field, and then cleaned by having any records with missing data removed.

## Setting the root data set:
```r
tech_data<-read.csv('tech_data.csv')
```
**Add Libraries
```r
library(tidyr)
library(dplyr)
library(ggplot2)
```

##My Overall Question
Going into this analysis, the question I want to research is whether there are any variables present in the data set that could be used to predict the future directional change of a stock’s value. This question will be refined and adjusted as I explore the dataset.

##First Look

```r
# Obtain a list of the symbols for the top 5 information technology stocks
top_symbols <- tech_data %>%
  group_by(symbol) %>%
  summarise(avg_volume = mean(volume, na.rm = TRUE)) %>%
  arrange(desc(avg_volume)) %>%
  slice(1:5) %>%
  pull(symbol)

# Create smaller data set by filtering larger data set by the created list of top 5 information technology stock symbols
tech_top <- tech_data %>%
  filter(symbol %in% top_symbols)

ggplot(tech_top, aes(x = date, y = close, color = Security)) +
     geom_line() +
     theme_minimal()+
     labs(title = "Top 5 Tech Stocks by Avg Volume",
          x = "Date", y = "Closing Price")
```

![Top 5 Companies by closing price](images/top_5_tech_company_closing_prices.png)

