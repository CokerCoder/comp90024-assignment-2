FROM python:3

WORKDIR /home/ubuntu/COMP90024/ccc-p2/crawler/src

# Install dependencies

COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python3", "crawl_realtime.py"] 