from bottle import route, run, static_file

root = '/home/ryan/projects/react/tagged/'

@route('/')
def index():
    return static_file('index.html', root=root)

@route('/<filename>')
def serve_static(filename):
    return static_file(filename, root=root)

run(host='192.168.1.150', port=8000, debug=True)
