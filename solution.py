# Write your code here
a=input()
ck=True
for i in range(0,a.size()/2):
    if(a[i]!=a[a.size()-i-1]):
        ck=False
if ck:
    print("true")
else:
    print("false")    






