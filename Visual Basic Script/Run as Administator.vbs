do while WScript.Arguments.Count=0 and WScript.Version>=5.7
    Set sha=CreateObject("Shell.Application")
    sha.ShellExecute "wscript.exe",""""+WScript.ScriptFullName+""" uac","","runas"
    WScript.Quit
loop
