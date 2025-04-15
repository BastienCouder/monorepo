// create file
ansible-vault create vars/secrets.yml

// view file
ansible-vault view vars/secrets.yml

// encrypt file
ansible-vault encrypt vars/secrets.yml

// decrypt file
ansible-vault decrypt vars/secrets.yml

// run playbook
ansible-playbook -i inventory playbook.yml

// run playbook check
ansible-playbook -i inventory.ini playbook.yml --ask-become-pass --check