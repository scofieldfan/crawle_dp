
files=`find ../data/ -name *.csv`
echo $files
for file in $files
do
	filename=`echo $file|sed 's/\.\.\/data\///'`
	echo $file
	echo $filename
	iconv -f 'utf8' -t 'gb18030' $file > ../output/$filename
done
tar -zcvf output.tar.gz ../output/
