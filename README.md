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

## My Overall Question
Going into this analysis, the question I want to research is whether there are any variables present in the data set that could be used to predict the future directional change of a stock’s value. This question will be refined and adjusted as I explore the dataset.

## First Look
To start off I will first take a look at the top 5 Information Technology companies to get a visual comparison of how their closing prices compare over time. To do this I will first need to figure out what the top five companies are and create a small dataframe that contains just their information. I will be using a company's average daily trading volumn as the metric for comparing the companies against each other when determine the top five companies. Finally I will use ggplot to generate a line graph so we can visualy the closing prices for the stocks over the span of the data set. 

1. Select the top 5 Technology Stocks by average volume to create a sub data set.

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
```

2. Create a multi-line graph to display the closing values of the top 5 tech stocks over the span of the data set.

```r
ggplot(tech_top, aes(x = date, y = close, color = Security)) +
     geom_line() +
     theme_minimal()+
     labs(title = "Top 5 Tech Stocks by Avg Volume",
          x = "Date", y = "Closing Price")
```

![Top 5 Companies by closing price](images/top_5_tech_company_closing_prices.png)

This graph shows the time series data for the daily closing prices of the top five performing stocks in the Information Technology sector. The results were limited to the top 5 stocks in this sector due to the Information Technology sector comprising 40 different stocks, which was done for readability purposes. The top technology stocks were determined by comparing their average daily trading volume with that of the stocks in the sector. According to the graph, Apple Inc. was the best-performing stock, with an overall upward trend that significantly outperformed the other four top stocks. Microsoft is next in line.

## Average Daily Trading Volume for All Information Technoloy Stocks

Previously, we extracted the top 5 Information Technology stocks to compare against each other. This time, we will use a bar chart to plot the values of every stock in the Information Technology sector to see if any information can be derived. To do this I will be finding the mean of the daily trading volumes for each stock.

1. Calculate the average volume of the technology stocks.

```r
avg_volume_data <- tech_data %>%
  group_by(symbol, Security) %>%
  summarise(avg_volume = mean(volume, na.rm = TRUE), .groups = "drop")
```

2. Create a bar chart that shows the average trading volume of each company in the Information Technology sector.

```r
ggplot(avg_volume_data, aes(x = Security, y = avg_volume)) +
  geom_bar(stat = "identity", fill = "#97B3C6", color="white") +
  theme_minimal()+
  labs(title = "Average Trading Volume by Tech Company",
       x = "Company",
       y = "Average Volume") +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))
```

![Average Trading Volume  by Tech Company](avg_trading_vol_by_tech_company.png)

The graph displays the names of companies in the Information Technology sector along the X-axis and their average trading volume on the Y-axis. Examining this graph alongside our first graph, we can see similarities between the top 5 performing Information Technology stocks. The top 5 performing Information Technology stocks are the same stocks shown on this graph, which have the top 5 average daily trading volumes; however, their ranking order is slightly different. Returning to my original question, these first two graphs lead me to wonder if daily trading volume has a significant impact on a stock’s performance.

