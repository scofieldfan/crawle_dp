
files=`find ../data -name *.csv`
echo $files
for file in $files
do
	iconv -f 'utf8' -t 'gb18030' $file > $file.excel
done
