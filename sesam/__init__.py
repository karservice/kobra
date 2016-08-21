# -*- coding: utf-8 -*-
from collections import namedtuple
from os import path
import uuid

import requests
from requests_file import FileAdapter
import suds.client
import suds.wsse
import suds_requests

# Being dependent on an internet connection to simply instantiate an API client
# is horrible. Therefore, we used a downloaded copy of the complete WSDL.
# Download newer versions with the ?singleWsdl option.
DEFAULT_STUDENT_SERVICE_WSDL_URL = 'file://{}'.format(
    path.join(__path__[0], 'StudentService.2_0.test.wsdl'))
DEFAULT_STUDENT_SERVICE_PORT = 'BasicHttpBinding_IStudentService'

EXCLUDED_SECTION_CODES = [
    # These student union codes are not considered to be sections and are thus
    # not passed on to the Student object.

    # Legacy membership codes
    'LI10',
    'LI12',
    'LI20',
    'LI21',
    'LI22',
    'LI30',
    'LI40',
    'LI41',
    'LI42',
    'LI50',
    'LI51',
    'LI52',
    'LI80',
    'LI90',

    # Union membership only
    'Cons',  # Consensus
    'LinT',  # LinTek
    'StuF',  # StuFF

    # Independent courses
    'Fri',  # Consensus
    'FriL',  # LinTek
    'FriS',  # StuFF

    # Support membership
    'Stöd',  # Consensus
    'StöL',  # LinTek
    'StöF',  # StuFF
]


NOT_FOUND_MESSAGE = 'Could not find Student in database'


# Using a namedtuple gives us immutability and a more defined API for Sesam's
# results than using a plain dict. Still it offers an easy way of mocking
# responses for testing.
SesamStudent = namedtuple('SesamStudent', [
    'liu_id',
    'name',
    'union',
    'section_code',
    'nor_edu_person_lin',
    'liu_lin',
    'email'
])


class StudentNotFound(LookupError):
    pass


class TempSesamStudentServiceClient(suds.client.Client):
    # Temporary version of the client used for StudentService 1.0
    def __init__(self, username, password,
                 url='file://{}'.format(path.join(__path__[0], 'StudentService.1_0.wsdl')),
                 port=DEFAULT_STUDENT_SERVICE_PORT, **kwargs):
        wsse = suds.wsse.Security()
        wsse.tokens.append(
            suds.wsse.UsernameToken(username, password)
        )

        session = requests.Session()
        session.mount('file://', FileAdapter())  # For loading the local WSDL

        super(TempSesamStudentServiceClient, self).__init__(
            url=url,
            port=port,
            transport=suds_requests.RequestsTransport(session),
            wsse=wsse,
            **kwargs
        )

    def get_union(self, nor_edu_person_lin):
        request = self.factory.create('ns11:GetUnionRequest')
        request.norEduPersonLIN = nor_edu_person_lin

        return self.service.GetUnion(request)


class SesamStudentServiceClient(suds.client.Client):
    def __init__(self, username, password, temp_username, temp_password,
                 url=DEFAULT_STUDENT_SERVICE_WSDL_URL,
                 port=DEFAULT_STUDENT_SERVICE_PORT, **kwargs):
        wsse = suds.wsse.Security()
        wsse.tokens.append(
            suds.wsse.UsernameToken(username, password)
        )

        session = requests.Session()
        session.mount('file://', FileAdapter())  # For loading the local WSDL

        super(SesamStudentServiceClient, self).__init__(
            url=url,
            port=port,
            transport=suds_requests.RequestsTransport(session),
            wsse=wsse,
            **kwargs
        )

        # TEMPORARY: delete this when StudentService 2.0 reaches production
        self.union_service = TempSesamStudentServiceClient(temp_username, temp_password)

    def get_student(self, nor_edu_person_lin=None, liu_id=None, mifare_id=None,
                    national_id=None, iso_id=None):
        # Removes leading zeros from card numbers
        if iso_id:
            iso_id = str(iso_id).lstrip('0')
        if mifare_id:
            mifare_id = str(mifare_id).lstrip('0')

        request = self.factory.create('ns2:GetStudentRequest')

        request.Identity.IsoNumber = iso_id
        request.Identity.LiUId = liu_id
        request.Identity.MifareNumber = mifare_id
        request.Identity.norEduPersonLIN = nor_edu_person_lin
        request.Identity.norEduPersonNIN = national_id

        try:
            data = self.service.GetStudent(request).Student
        except suds.WebFault as exception:
            if NOT_FOUND_MESSAGE in exception.fault.faultstring:
                raise StudentNotFound
            raise exception

        # TEMPORARY: delete this when StudentService 2.0 reaches production
        unions = self.union_service.get_union(data.norEduPersonLIN)

        return SesamStudent(
            liu_id=str(data.LiUId),
            name=str(data.DisplayName),
            union=str(unions.MainUnion) if unions.MainUnion else None,
            # This abstraction is a bit ugly. It returns the raw codes from
            # Sesam but not in every case.
            # todo: look for a better abstraction for section_code.
            section_code=str(unions.StudentUnion) if (
                unions.StudentUnion and
                unions.StudentUnion not in EXCLUDED_SECTION_CODES
            ) else None,
            email=str(data.EmailAddress),
            nor_edu_person_lin=uuid.UUID(data.norEduPersonLIN),
            liu_lin=uuid.UUID(data.LiULIN)
        )

        # return SesamStudent(
        #     liu_id=str(data.LiUId),
        #     name=str(data.DisplayName),
        #     union=str(data.MainUnion) if data.MainUnion else None,
        #     # This abstraction is a bit ugly. It returns the raw codes from
        #     # Sesam but not in every case.
        #     # todo: look for a better abstraction for section_code.
        #     section_code=str(data.StudentUnion) if (
        #         data.StudentUnion and
        #         data.StudentUnion not in EXCLUDED_SECTION_CODES
        #     ) else None,
        #     email=str(data.EmailAddress),
        #     nor_edu_person_lin=uuid.UUID(data.norEduPersonLIN),
        #     liu_lin=uuid.UUID(data.LiULIN)
        # )
