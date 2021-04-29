FROM python:3

WORKDIR /home/ubuntu/COMP90024/ccc-p2/crawler

ADD . /

# Install dependencies
RUN pip3 freeze > requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "crawl_realtime.py"]