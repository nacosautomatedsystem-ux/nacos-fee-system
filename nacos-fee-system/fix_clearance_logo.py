import re

file_path = r'c:\Users\HELLO\Desktop\NACOS Automated system\nacos-fee-system\src\app\student\clearance\page.tsx'

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific Google URL with the local logo path
content = content.replace(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAAyopBYEjY2JWCS9Z1xfMQhVdY3VZeUklB1w3wTkaHnyynTkmlvMDjH1x2UN57myWX2Oj6sry1n_1KIQyaeb08COdUAlbwkiVzudDUhnhFcYj-ol0pb6j9qi4BeaQSGx924jnwIzcVi1NgGEnNJoK7OBkf39zPeB5-wiEp-ZhvqEVe7YnrqBrMlwfeUFWqwigJwNugz7p_W3tfRtGznunDRCIeIcJBzJ5zB-x3kdoRFsfb610BUDanHNHAdr9eqWqXd3x0Ddr4rMg',
    '/images/nacos-logo.png'
)

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Logo URL updated successfully in clearance page!")
