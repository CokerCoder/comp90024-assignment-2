FROM python:3

WORKDIR /home/ubuntu/COMP90024/ccc-p2/crawler

COPY . .

# Install dependencies
RUN pip3 install -r requirements.txt

CMD ["crawl_realtime.py"]

ENTRYPOINT ["python3"]