FROM python:3.12.3
WORKDIR /manage.py
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# TODO stage 2
EXPOSE 8000
# Execute migrations and the server
CMD [{"python", "manage.py", "migrate"}, {"python", "manage.py", "runserver", "0.0.0.0:8000"}]