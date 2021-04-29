FROM python:3

ADD . /

# Install dependencies

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python3", "src/crawl_realtime.py"] 