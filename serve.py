from bottle import route, run, static_file

root = '/home/ryan/projects/react/tagged/'

@route('/')
def index():
    return static_file('index.html', root=root)

@route('/<filename>')
def server_static(filename):
    return static_file(filename, root=root)

'''@route('/<any:path>')
def send_any(any):
    if any == 'app.js':
        return static_file('app.js', root=root)
    elif any == 'vendor.js':
        return static_file('vendor.js', root=root)
    elif any == 'index.css':
        return static_file('index.css', root=root)
    elif any == 'reset.css':
        return static_file('reset.css', root=root)
    elif any == 'dropbox-logo-128.png':
        return static_file('dropbox-logo-128.png', root=root)
    elif any == 'google-drive-logo-128.png':
        return static_file('google-drive-logo-128.png', root=root)
    return static_file('index.html', root=root)'''

run(host='192.168.1.150', port=8080, debug=True)
