# Read data
data <- read.table("HadCRUT4-gl-dowload20170601.dat", fill = TRUE)
names(data) = c("Year", month.abb, "Annual")

# Get temperature
temp <- data[seq(1, nrow(data), by = 2),]
cove <- data[seq(2, nrow(data), by = 2),]

# Set uncovered months to NA
mat = !(cove[month.abb] == 0)
mat[!mat] = NA
temp[month.abb] = temp[month.abb] * mat

# save RData
save(temp, file = "r/HadCRUT4-gl-download20170601.RData")

# save JSON
library(jsonlite)
cat(toJSON(temp, pretty = T))
write(paste("data =", toJSON(temp, pretty = T)), file = "js/HadCRUT4-gl-download20170601.json")
